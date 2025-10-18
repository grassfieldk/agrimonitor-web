"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { NumberInput } from "@/components/ui/NumberInput";
import { ToggleButton } from "@/components/ui/ToggleButton";
import type { VegetableInfo } from "@/types/types";

export default function VegetablesAdminPage() {
  const [vegetables, setVegetables] = useState<VegetableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVegetable, setEditingVegetable] =
    useState<VegetableInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiBaseUrl = "/api/crud?table=vegetables";

  const fetchVegetables = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(apiBaseUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch vegetables data");
      }
      const result = await response.json();
      setVegetables(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVegetables();
  }, [fetchVegetables]);

  const handleEdit = (vegetable: VegetableInfo) => {
    setEditingVegetable({ ...vegetable });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const response = await fetch(`${apiBaseUrl}&id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete vegetable");
      }
      await fetchVegetables();
    } catch (err) {
      alert(err instanceof Error ? err.message : "削除に失敗しました");
    }
  };

  const handleSave = async () => {
    if (!editingVegetable) return;

    try {
      const isNew = !editingVegetable.id;
      const url = isNew
        ? apiBaseUrl
        : `${apiBaseUrl}&id=${editingVegetable.id}`;

      const response = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingVegetable),
      });

      if (!response.ok) {
        throw new Error("Failed to save vegetable");
      }

      setIsModalOpen(false);
      setEditingVegetable(null);
      await fetchVegetables();
    } catch (err) {
      alert(err instanceof Error ? err.message : "保存に失敗しました");
    }
  };

  const handleAdd = () => {
    const newVegetable: VegetableInfo = {
      id: 0,
      name: "",
      enabled: true,
      temperature: {
        germination: {
          optimumRange: { low: null, high: null },
          limitRange: { low: null, high: null },
        },
        growth: {
          optimumRange: { low: null, high: null },
          limitRange: { low: null, high: null },
        },
      },
    };
    setEditingVegetable(newVegetable);
    setIsModalOpen(true);
  };

  const handleTemperatureChange = (
    stage: "germination" | "growth",
    rangeType: "optimumRange" | "limitRange",
    tempType: "low" | "high",
    value: string,
  ) => {
    if (!editingVegetable) return;

    const numValue = value === "" ? null : Number(value);
    const newVegetable = { ...editingVegetable };
    newVegetable.temperature[stage][rangeType][tempType] = numValue;
    setEditingVegetable(newVegetable);
  };

  const handleEnabledToggle = async (
    vegetableId: number,
    currentEnabled: boolean,
  ) => {
    const newEnabled = !currentEnabled;
    setVegetables((prevVegetables) =>
      prevVegetables.map((v) =>
        v.id === vegetableId ? { ...v, enabled: newEnabled } : v,
      ),
    );

    try {
      const currentVegetable = vegetables.find((v) => v.id === vegetableId);
      if (!currentVegetable) {
        throw new Error("野菜データが見つかりません");
      }

      const updatedVegetable = {
        ...currentVegetable,
        enabled: newEnabled,
      };

      const response = await fetch(`${apiBaseUrl}&id=${vegetableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVegetable),
      });

      if (!response.ok) {
        throw new Error("Failed to update vegetable");
      }
    } catch (err) {
      setVegetables((prevVegetables) =>
        prevVegetables.map((v) =>
          v.id === vegetableId ? { ...v, enabled: currentEnabled } : v,
        ),
      );
      alert(err instanceof Error ? err.message : "更新に失敗しました");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <div className="text-xl">エラー: {error}</div>
        <button
          type="button"
          onClick={fetchVegetables}
          className="mt-4 px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-500"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">適正温度設定</h1>
        <Button onClick={handleAdd} icon="add">
          追加
        </Button>
      </div>

      {vegetables.length === 0 ? (
        <div className="text-center py-12">野菜データがありません</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="rounded-lg">
            <thead>
              <tr>
                <th>操作</th>
                <th>野菜名</th>
                <th>表示</th>
                <th className="hidden sm:table-cell">発芽適温</th>
                <th className="hidden lg:table-cell">発芽限界</th>
                <th className="hidden sm:table-cell">生育適温</th>
                <th className="hidden lg:table-cell">生育限界</th>
              </tr>
            </thead>
            <tbody>
              {vegetables.map((vegetable) => (
                <tr key={vegetable.id} className="border-t border-neutral-700">
                  <td>
                    <div className="flex justify-center gap-1">
                      <Button
                        title="編集"
                        onClick={() => handleEdit(vegetable)}
                        size="sm"
                        className="p-2"
                      >
                        <FiEdit2 size={16} />
                      </Button>
                      <Button
                        title="削除"
                        onClick={() => handleDelete(vegetable.id)}
                        variant="secondary"
                        size="sm"
                        className="p-2"
                      >
                        <FiTrash2 size={16} />
                      </Button>
                    </div>
                  </td>
                  <td>{vegetable.name}</td>
                  <td>
                    <ToggleButton
                      isOn={vegetable.enabled}
                      onToggle={() =>
                        handleEnabledToggle(vegetable.id, vegetable.enabled)
                      }
                      size="sm"
                    >
                      {vegetable.enabled ? "有効" : "無効"}
                    </ToggleButton>
                  </td>
                  <td className="hidden sm:table-cell">
                    {vegetable.temperature.germination.optimumRange.low ?? "－"}
                    ℃ ～{" "}
                    {vegetable.temperature.germination.optimumRange.high ??
                      "－"}
                    ℃
                  </td>
                  <td className="hidden lg:table-cell">
                    {vegetable.temperature.germination.limitRange.low ?? "－"}℃
                    ～{" "}
                    {vegetable.temperature.germination.limitRange.high ?? "－"}℃
                  </td>
                  <td className="hidden sm:table-cell">
                    {vegetable.temperature.growth.optimumRange.low ?? "－"}℃ ～{" "}
                    {vegetable.temperature.growth.optimumRange.high ?? "－"}℃
                  </td>
                  <td className="hidden lg:table-cell">
                    {vegetable.temperature.growth.limitRange.low ?? "－"}℃ ～{" "}
                    {vegetable.temperature.growth.limitRange.high ?? "－"}℃
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-foreground/60" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-3xl space-y-4 bg-background rounded-lg p-4 shadow-2xl">
            <DialogTitle className="text-center text-xl font-bold">
              {editingVegetable?.id ? "編集" : "追加"}
            </DialogTitle>
            <div className="space-y-4 max-h-[calc(100vh-30px)] overflow-y-auto">
              <div>
                <label
                  htmlFor="vegetable-name"
                  className="block text-sm font-medium mb-1"
                >
                  野菜名 *
                </label>
                <Input
                  id="vegetable-name"
                  value={editingVegetable?.name || ""}
                  onChange={(e) =>
                    editingVegetable &&
                    setEditingVegetable({
                      ...editingVegetable,
                      name: e.target.value,
                    })
                  }
                  placeholder="例: トマト"
                  required
                />
              </div>
              <div>
                <label htmlFor="enabled" className="flex items-center gap-2">
                  <Checkbox
                    id="enabled"
                    checked={editingVegetable?.enabled || false}
                    onChange={(e) =>
                      editingVegetable &&
                      setEditingVegetable({
                        ...editingVegetable,
                        enabled: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm">トップページに表示</span>
                </label>
              </div>
              <div>
                <h3 className="text-base font-medium mb-2">発芽期</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="germ-opt-low"
                      className="block text-sm mb-1"
                    >
                      適正温度
                    </label>
                    <div className="flex items-center gap-1">
                      <NumberInput
                        id="germ-opt-low"
                        value={
                          editingVegetable?.temperature.germination.optimumRange
                            .low ?? null
                        }
                        onChange={(e) =>
                          editingVegetable &&
                          handleTemperatureChange(
                            "germination",
                            "optimumRange",
                            "low",
                            e.target.value,
                          )
                        }
                        placeholder="最低"
                      />
                      <span className="text-xs">～</span>
                      <NumberInput
                        id="germ-opt-high"
                        value={
                          editingVegetable?.temperature.germination.optimumRange
                            .high ?? null
                        }
                        onChange={(e) =>
                          editingVegetable &&
                          handleTemperatureChange(
                            "germination",
                            "optimumRange",
                            "high",
                            e.target.value,
                          )
                        }
                        placeholder="最高"
                      />
                      <span className="text-xs">℃</span>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="germ-limit-low"
                      className="block text-sm mb-1"
                    >
                      限界温度
                    </label>
                    <div className="flex items-center gap-1">
                      <NumberInput
                        id="germ-limit-low"
                        value={
                          editingVegetable?.temperature.germination.limitRange
                            .low ?? null
                        }
                        onChange={(e) =>
                          editingVegetable &&
                          handleTemperatureChange(
                            "germination",
                            "limitRange",
                            "low",
                            e.target.value,
                          )
                        }
                        placeholder="最低"
                      />
                      <span className="text-xs">～</span>
                      <NumberInput
                        id="germ-limit-high"
                        value={
                          editingVegetable?.temperature.germination.limitRange
                            .high ?? null
                        }
                        onChange={(e) =>
                          editingVegetable &&
                          handleTemperatureChange(
                            "germination",
                            "limitRange",
                            "high",
                            e.target.value,
                          )
                        }
                        placeholder="最高"
                      />
                      <span className="text-xs">℃</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-base font-medium mb-2">生育期</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="growth-opt-low"
                      className="block text-sm mb-1"
                    >
                      適正温度
                    </label>
                    <div className="flex items-center gap-1">
                      <NumberInput
                        id="growth-opt-low"
                        value={
                          editingVegetable?.temperature.growth.optimumRange
                            .low ?? null
                        }
                        onChange={(e) =>
                          editingVegetable &&
                          handleTemperatureChange(
                            "growth",
                            "optimumRange",
                            "low",
                            e.target.value,
                          )
                        }
                        placeholder="最低"
                      />
                      <span className="text-xs">～</span>
                      <NumberInput
                        id="growth-opt-high"
                        value={
                          editingVegetable?.temperature.growth.optimumRange
                            .high ?? null
                        }
                        onChange={(e) =>
                          editingVegetable &&
                          handleTemperatureChange(
                            "growth",
                            "optimumRange",
                            "high",
                            e.target.value,
                          )
                        }
                        placeholder="最高"
                      />
                      <span className="text-xs">℃</span>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="growth-limit-low"
                      className="block text-sm mb-1"
                    >
                      限界温度
                    </label>
                    <div className="flex items-center gap-1">
                      <NumberInput
                        id="growth-limit-low"
                        value={
                          editingVegetable?.temperature.growth.limitRange.low ??
                          null
                        }
                        onChange={(e) =>
                          editingVegetable &&
                          handleTemperatureChange(
                            "growth",
                            "limitRange",
                            "low",
                            e.target.value,
                          )
                        }
                        placeholder="最低"
                      />
                      <span className="text-xs">～</span>
                      <NumberInput
                        id="growth-limit-high"
                        value={
                          editingVegetable?.temperature.growth.limitRange
                            .high ?? null
                        }
                        onChange={(e) =>
                          editingVegetable &&
                          handleTemperatureChange(
                            "growth",
                            "limitRange",
                            "high",
                            e.target.value,
                          )
                        }
                        placeholder="最高"
                      />
                      <span className="text-xs">℃</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingVegetable(null);
                }}
                variant="secondary"
              >
                キャンセル
              </Button>
              <Button
                onClick={handleSave}
                disabled={!editingVegetable?.name.trim()}
              >
                保存
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
