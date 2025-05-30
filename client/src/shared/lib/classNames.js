export function classNames(...res) {
  return res
    .reduce((prev, currentValue) => {
    if (Array.isArray(currentValue)) {
      prev.push(...(currentValue.filter((el) => !!el)));
    } else if (typeof currentValue === "string" && currentValue) {
      prev.push(currentValue);
    } else if (typeof currentValue === "object") {
      const validCLs = Object.keys(currentValue).filter((clsKey) => !!currentValue[clsKey]);
      prev.push(validCLs.join(" "));
    }
    return prev;
  }, [])
    .join(" ");
}
