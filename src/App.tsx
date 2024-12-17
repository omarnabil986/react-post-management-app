import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import axios from "axios";

const App: React.FC = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [form] = Form.useForm();

  // Fetch data from API
  const fetchData = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    setData(response.data);
  };

  // Open the Edit modal and pre-fill form with post details
  const handleEdit = (post: any) => {
    setCurrentPost(post);
    form.setFieldsValue({
      title: post.title,
      body: post.body,
    });
    setIsModalVisible(true);
  };

  // Handle form submission to update post
  const handleUpdatePost = async (values: { title: string; body: string }) => {
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${currentPost.id}`,
        {
          title: values.title,
          body: values.body,
        }
      );

      if (response && response.data) {
        setData(
          data.map((post: any) =>
            post.id === currentPost.id ? response.data : post
          )
        );
        notification.success({
          message: "Success",
          description: "Post updated successfully!",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update post. Please try again.",
      });
    } finally {
      form.resetFields();
      setIsModalVisible(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );

      if (response.status === 200) {
        // Remove the deleted post from the state
        setData(data.filter((post: any) => post.id !== id));
        notification.success({
          message: "Success",
          description: "Post deleted successfully!",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete post. Please try again.",
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Body",
      dataIndex: "body",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            type="primary"
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(record.id)} type="danger">
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={fetchData}>
        Fetch Posts
      </Button>
      <Table dataSource={data} columns={columns} rowKey="id" />

      <Modal
        title="Edit Post"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdatePost}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Body"
            name="body"
            rules={[{ required: true, message: "Please input the body!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Post
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
