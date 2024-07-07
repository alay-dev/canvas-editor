import { Flex } from "antd";

export default function Center(props: any) {
  const { children, height = 46, style, ...rest } = props;

  return (
    <Flex
      justify="center"
      align="center"
      {...rest}
      style={{ height, ...style }}
    >
      {children}
    </Flex>
  );
}

export const CenterH = (props: any) => {
  return <Center align="normal" {...props} />;
};

export const CenterV = (props: any) => {
  return <Center justify="normal" {...props} />;
};
