import "@mantine/core/styles.css";
import {
  Box,
  Checkbox,
  MantineProvider,
  ScrollArea,
  Text,
} from "@mantine/core";
import { theme } from "./theme";
import { Virtuoso, ScrollerProps } from "react-virtuoso";
import { forwardRef, useState } from "react";
import classes from "./CustomScroll.module.css";

const data = Array(10000)
  .fill(0)
  .map((_, i) => ({ value: `${i}`, label: `Value ${i}` }));

// if you need to do some conditional logic, use Virtuoso's context prop to pass props inside the Scroller
const Scroller = forwardRef<
  HTMLDivElement,
  { style?: React.CSSProperties } & ScrollerProps
>(({ style, ...props }, ref) => {
  return (
    <div
      style={{ ...style }}
      className={classes.customScroll}
      ref={ref}
      {...props}
    />
  );
});

export default function App() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const allSelected = selected.size === data.length;
  const indeterminate = selected.size > 0 && !allSelected;

  function handleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      const allValues = data.map(({ value }) => value);
      setSelected(new Set(allValues));
    }
  }
  return (
    <MantineProvider theme={theme}>
      <Box p="xl">
        <Checkbox
          label="Select all"
          mb="xl"
          indeterminate={indeterminate}
          onChange={() => handleSelectAll()}
        />
        <Virtuoso
          style={{ height: 200 }}
          totalCount={data.length}
          components={{
            Scroller,
          }}
          itemContent={(index) => {
            const item = data[index];
            const label = item.label ?? item.value;
            return (
              <Checkbox
                mb="sm"
                key={item.value}
                value={label}
                label={label}
                onChange={(e) => {
                  setSelected((current) => {
                    const next = new Set(current);
                    const { checked } = e.currentTarget;
                    if (checked) {
                      next.add(item.value);
                    } else {
                      next.delete(item.value);
                    }
                    return next;
                  });
                }}
                checked={selected.has(item.value)}
              />
            );
          }}
        />
        <Text>
          {allSelected ? "All selected " : "selected "}
          {selected.size}
        </Text>
      </Box>
    </MantineProvider>
  );
}
