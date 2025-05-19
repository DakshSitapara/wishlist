export const handleResetFilters = (
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>,
    setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>,
    setPriceRange: React.Dispatch<React.SetStateAction<{ min: string; max: string }>>,
    setSelectedPriorities: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setPriceRange({ min: '', max: '' });
    setSelectedPriorities([]);
  };
  