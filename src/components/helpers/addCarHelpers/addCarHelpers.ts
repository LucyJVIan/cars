export const engineTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: string) => void,
    setIsElectric: (isElectric: boolean) => void
  ) => {
    const value = event.target.value;
    setFieldValue("engineType", value);
    if (value === "Электрический") {
      setIsElectric(true);
      setFieldValue("transmission", null);
    } else {
      setIsElectric(false);
    }
  };
  