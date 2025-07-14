type GroupedItem = {
  name: any;
  prefix: string;
  method: any[];
};

export const grouped = (data: any) =>
  Object.values(
    data?.reduce((acc: Record<string, GroupedItem>, item: any) => {
      const key = JSON.stringify(item.name); // group by name (en + ar)

      if (!acc[key]) {
        acc[key] = {
          name: item.name,
          prefix: item.prefix,
          method: [],
        };
      }

      acc[key].method.push(item.method);
      return acc;
    }, {}),
  );
