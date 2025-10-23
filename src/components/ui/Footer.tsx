interface FooterProps {
  children: React.ReactNode;
}

export const Footer = ({ children }: FooterProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-foreground border-t border-foreground-nd p-4 shadow-lg h-16">
      <div className="flex justify-center items-center gap-4 h-full">
        {children}
      </div>
    </div>
  );
};
