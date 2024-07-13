// @ts-nocheck

import { Button, Form, Row, Col, InputNumber, Switch } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import MoreConfigWrapper from "../Form/MoreConfigWrapper";
import { GloablStateContext } from "@/context/global-context";

const { Item: FormItem } = Form;

const PxInputNumber = (props) => {
  const { value, onChange, ...rest } = props;
  const [innerValue, setInnerValue] = useState(value);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <InputNumber
      style={{ width: "100%" }}
      controls={false}
      step={1}
      precision={2}
      changeOnBlur
      value={innerValue}
      onChange={setInnerValue}
      onPressEnter={() => {
        onChange?.(innerValue);
      }}
      {...rest}
    />
  );
};

const noScaledSizeTypes = ["textbox", "custom-text", "rect"];

export default function PositionSetter() {
  const { editor, object } = useContext(GloablStateContext);
  const [showMore, setShowMore] = useState(false);
  const isNoScaledSizeTypeRef = useRef(false);
  const [form] = Form.useForm();

  const handleSize = (key, value) => {
    const realValue = value - object.strokeWidth;
    if (key === "width") {
      if (isNoScaledSizeTypeRef.current) {
        object.set({
          width: realValue,
          scaleX: 1,
          scaleY: 1,
        });
      } else {
        object.scaleToWidth(realValue, true);
      }
    } else if (key === "height") {
      if (isNoScaledSizeTypeRef.current) {
        object.set({
          height: realValue,
          scaleX: 1,
          scaleY: 1,
        });
      } else {
        object.scaleToHeight(realValue, true);
      }
    }
  };

  const handleChange = (values) => {
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (key === "width" || key === "height") {
        handleSize(key, value);
        setFormData();
      } else {
        object.set(key, value);
      }
    });

    editor.canvas.requestRenderAll();
    editor.fireCustomModifiedEvent();
  };

  const setFormData = () => {
    form.setFieldsValue({
      width: object.getScaledWidth(),
      height: object.getScaledHeight(),
      lockRatio: true,
      left: object.left,
      top: object.top,
      angle: object.angle,
    });
  };

  const handleModified = () => {
    setFormData();
  };

  const init = () => {
    isNoScaledSizeTypeRef.current = noScaledSizeTypes.includes(object.type);
    setFormData();

    object.on("modified", handleModified);

    return () => {
      object.off("modified", handleModified);
    };
  };

  useEffect(() => {
    if (
      (showMore && object && !object.group) ||
      object.type !== "activeSelection"
    ) {
      init();
    }
  }, [object, showMore]);

  return (
    <>
      <Button
        block
        onClick={() => {
          setShowMore(true);
        }}
      >
        Adjust position
      </Button>
      <MoreConfigWrapper
        open={showMore}
        setOpen={setShowMore}
        title="Adjust position"
      >
        <div style={{ marginTop: 24 }}>
          <Form
            form={form}
            layout="vertical"
            colon={false}
            onValuesChange={handleChange}
          >
            <Row gutter={8}>
              <Col span={8}>
                <FormItem label="Width (pixel)" name="width">
                  <PxInputNumber min={1} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Hight (pixel)" name="height">
                  <PxInputNumber min={1} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="Lock ratio"
                  name="lockRatio"
                  valuePropName="checked"
                >
                  <Switch disabled />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <FormItem label="X (pixel)" name="left">
                  <PxInputNumber />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Y (pixel)" name="top">
                  <PxInputNumber />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Rotate" name="angle">
                  <PxInputNumber min={-360} max={360} precision={0} />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </MoreConfigWrapper>
    </>
  );
}
