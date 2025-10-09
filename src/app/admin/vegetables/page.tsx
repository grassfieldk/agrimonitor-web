"use client";

import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import type { VegetableInfo } from "@/types/types";

export default function VegetablesAdminPage() {
  const [vegetables, setVegetables] = useState<VegetableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVegetable, setEditingVegetable] =
    useState<VegetableInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVegetables = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/crud?table=vegetables");
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
      const response = await fetch(`/api/crud?table=vegetables&id=${id}`, {
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
        ? "/api/crud?table=vegetables"
        : `/api/crud?table=vegetables&id=${editingVegetable.id}`;

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
    <div className="p-8 bg-neutral-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">野菜の適正温度管理</h1>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-500"
          >
            <FiPlus size={16} />
            新規追加
          </button>
        </div>

        {vegetables.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            野菜データがありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-neutral-800 rounded-lg overflow-hidden">
              <thead className="bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-center w-20">操作</th>
                  <th className="px-4 py-3 text-left">野菜名</th>
                  <th className="px-4 py-3 text-center">発芽適温</th>
                  <th className="px-4 py-3 text-center">発芽限界</th>
                  <th className="px-4 py-3 text-center">生育適温</th>
                  <th className="px-4 py-3 text-center">生育限界</th>
                </tr>
              </thead>
              <tbody>
                {vegetables.map((vegetable) => (
                  <tr
                    key={vegetable.id}
                    className="border-t border-neutral-700"
                  >
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(vegetable)}
                          className="p-2 bg-neutral-600 text-white rounded hover:bg-neutral-500 transition-colors"
                          title="編集"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(vegetable.id)}
                          className="p-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 transition-colors"
                          title="削除"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{vegetable.name}</td>
                    <td className="px-4 py-3 text-center text-sm">
                      {vegetable.temperature.germination.optimumRange.low ??
                        "-"}
                      ℃ ～{" "}
                      {vegetable.temperature.germination.optimumRange.high ??
                        "-"}
                      ℃
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      {vegetable.temperature.germination.limitRange.low ?? "-"}℃
                      ～{" "}
                      {vegetable.temperature.germination.limitRange.high ?? "-"}
                      ℃
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      {vegetable.temperature.growth.optimumRange.low ?? "-"}℃ ～{" "}
                      {vegetable.temperature.growth.optimumRange.high ?? "-"}℃
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      {vegetable.temperature.growth.limitRange.low ?? "-"}℃ ～{" "}
                      {vegetable.temperature.growth.limitRange.high ?? "-"}℃
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {isModalOpen && editingVegetable && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-6">
                {editingVegetable.id ? "野菜データ編集" : "新規野菜追加"}
              </h2>

              <div className="space-y-6">
                {/* 野菜名 */}
                <div>
                  <label
                    htmlFor="vegetable-name"
                    className="block text-sm font-medium mb-2"
                  >
                    野菜名 *
                  </label>
                  <input
                    id="vegetable-name"
                    type="text"
                    value={editingVegetable.name}
                    onChange={(e) =>
                      setEditingVegetable({
                        ...editingVegetable,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-neutral-700 border border-neutral-500 rounded text-white"
                    placeholder="例: トマト"
                    required
                  />
                </div>

                {/* 発芽期温度 */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-green-400">
                    発芽期温度設定
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label
                        htmlFor="germ-opt-range"
                        className="block text-sm font-medium"
                      >
                        適正温度範囲
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="germ-opt-range"
                          type="number"
                          value={
                            editingVegetable.temperature.germination
                              .optimumRange.low ?? ""
                          }
                          onChange={(e) =>
                            handleTemperatureChange(
                              "germination",
                              "optimumRange",
                              "low",
                              e.target.value,
                            )
                          }
                          className="w-20 p-2 bg-neutral-700 border border-neutral-500 rounded text-white text-center"
                          placeholder="最低"
                        />
                        <span className="text-neutral-400">℃ ～</span>
                        <input
                          type="number"
                          value={
                            editingVegetable.temperature.germination
                              .optimumRange.high ?? ""
                          }
                          onChange={(e) =>
                            handleTemperatureChange(
                              "germination",
                              "optimumRange",
                              "high",
                              e.target.value,
                            )
                          }
                          className="w-20 p-2 bg-neutral-700 border border-neutral-500 rounded text-white text-center"
                          placeholder="最高"
                        />
                        <span className="text-neutral-400">℃</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="germ-limit-range"
                        className="block text-sm font-medium"
                      >
                        限界温度範囲
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="germ-limit-range"
                          type="number"
                          value={
                            editingVegetable.temperature.germination.limitRange
                              .low ?? ""
                          }
                          onChange={(e) =>
                            handleTemperatureChange(
                              "germination",
                              "limitRange",
                              "low",
                              e.target.value,
                            )
                          }
                          className="w-20 p-2 bg-neutral-700 border border-neutral-500 rounded text-white text-center"
                          placeholder="最低"
                        />
                        <span className="text-neutral-400">℃ ～</span>
                        <input
                          type="number"
                          value={
                            editingVegetable.temperature.germination.limitRange
                              .high ?? ""
                          }
                          onChange={(e) =>
                            handleTemperatureChange(
                              "germination",
                              "limitRange",
                              "high",
                              e.target.value,
                            )
                          }
                          className="w-20 p-2 bg-neutral-700 border border-neutral-500 rounded text-white text-center"
                          placeholder="最高"
                        />
                        <span className="text-neutral-400">℃</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 生育期温度 */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-blue-400">
                    生育期温度設定
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label
                        htmlFor="growth-opt-range"
                        className="block text-sm font-medium"
                      >
                        適正温度範囲
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="growth-opt-range"
                          type="number"
                          value={
                            editingVegetable.temperature.growth.optimumRange
                              .low ?? ""
                          }
                          onChange={(e) =>
                            handleTemperatureChange(
                              "growth",
                              "optimumRange",
                              "low",
                              e.target.value,
                            )
                          }
                          className="w-20 p-2 bg-neutral-700 border border-neutral-500 rounded text-white text-center"
                          placeholder="最低"
                        />
                        <span className="text-neutral-400">℃ ～</span>
                        <input
                          type="number"
                          value={
                            editingVegetable.temperature.growth.optimumRange
                              .high ?? ""
                          }
                          onChange={(e) =>
                            handleTemperatureChange(
                              "growth",
                              "optimumRange",
                              "high",
                              e.target.value,
                            )
                          }
                          className="w-20 p-2 bg-neutral-700 border border-neutral-500 rounded text-white text-center"
                          placeholder="最高"
                        />
                        <span className="text-neutral-400">℃</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="growth-limit-range"
                        className="block text-sm font-medium"
                      >
                        限界温度範囲
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="growth-limit-range"
                          type="number"
                          value={
                            editingVegetable.temperature.growth.limitRange
                              .low ?? ""
                          }
                          onChange={(e) =>
                            handleTemperatureChange(
                              "growth",
                              "limitRange",
                              "low",
                              e.target.value,
                            )
                          }
                          className="w-20 p-2 bg-neutral-700 border border-neutral-500 rounded text-white text-center"
                          placeholder="最低"
                        />
                        <span className="text-neutral-400">℃ ～</span>
                        <input
                          type="number"
                          value={
                            editingVegetable.temperature.growth.limitRange
                              .high ?? ""
                          }
                          onChange={(e) =>
                            handleTemperatureChange(
                              "growth",
                              "limitRange",
                              "high",
                              e.target.value,
                            )
                          }
                          className="w-20 p-2 bg-neutral-700 border border-neutral-500 rounded text-white text-center"
                          placeholder="最高"
                        />
                        <span className="text-neutral-400">℃</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingVegetable(null);
                  }}
                  className="px-6 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-500"
                  disabled={!editingVegetable.name.trim()}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
