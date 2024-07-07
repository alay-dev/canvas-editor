import { Divider } from "antd";

function Title(props: any) {
  const { children } = props;
  return <Divider>{children}</Divider>;
}

export default Title;
