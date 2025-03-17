import React from "react";

import { Card, Tag } from "antd";

const CardInfo: React.FC<{
  title: string;
  content: any;
  type: string;
  icon: any;
}> = ({ title, content, type, icon }) => {
  return (
    <Card
      title={
        <span>
          <span style={{ marginRight: "10px" }}>{icon}</span>
          {title}
        </span>
      }
    >
      {type === "text" && (
        <span>{content ? content : "Without information"}</span>
      )}
      {type === "tag" &&
        content?.map((element: string, index: number) => (
          <Tag key={index} style={{ margin: "0 4px 4px 0" }}>
            {element}
          </Tag>
        ))}
      {type === "tag" && !content?.length && "No availability"}
    </Card>
  );
};

export default CardInfo;
