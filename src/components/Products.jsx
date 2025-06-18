import { useEffect, useState } from "react";
import { api } from "../api";
import {
  Button,
  Card,
  Modal,
  Form,
  Input,
  Popconfirm,
  Rate,
  Empty,
  Radio,
  Tooltip,
  message,
} from "antd";
import { Image } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
const Products = () => {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [createLoading, setCreateLaoding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api.get("/products").then((res) => {
      setData(res.data);
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  const onFinish = (values) => {
    setCreateLaoding(true);
    if (editItem) {
      api
        .put(`/products/${editItem.id}`, values)
        .then(() => {
          message.success("Mahsulot yangilandi");
          fetchProducts();
          handleCancel();
        })
        .catch(() => message.error("Xatolik!"))
        .finally(() => setCreateLaoding(false));
    } else {
      api
        .post("/products", values)
        .then(() => {
          message.success("Mahsulot qo‘shildi");
          fetchProducts();
          handleCancel();
        })
        .catch(() => message.error("Xatolik!"))
        .finally(() => setCreateLaoding(false));
    }
  };

  const handleDelete = (id) => {
    api.delete(`/products/${id}`).then(() => {
      message.success("Mahsulot o‘chirildi");
      fetchProducts();
    });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    showModal();
  };

  const handleLike = (item) => {
    message.info(`Yoqtirildi: ${item.title}`);
  };

  const handleAddToCart = (item) => {
    message.success(`Korzinkaga qo‘shildi: ${item.title}`);
  };
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);
  return (
    <div className="max-w-[1200px] mx-auto px-3 mb-10">
      <div className="flex justify-center my-5">
        <Button
          className="w-[200px] h-[40px]"
          onClick={showModal}
          type="primary"
        >
          Create Products
        </Button>
      </div>

      <h2 className="text-[30px] font-semibold mx-auto mb-5 text-center">
        PRODUCTS
      </h2>

      {!data?.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

      <div className="flex flex-wrap gap-6 justify-center">
        {data?.map((item) => (
          <Card
            data-aos="flip-right"
            hoverable
            key={item.id}
            className="w-[240px] shadow-[0px_0px_10px_3px_#52009d] relative group"
            cover={
              <div className="relative">
                <div className="flex justify-center items-center h-[180px] bg-white">
                  <Image
                    className="object-contain w-[200px]"
                    style={{ height: 180 }}
                    src={item.image}
                    preview={false}
                  />
                </div>
                <div className="absolute inset-0 bg-black/30 flex justify-end p-2 items-start gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Tooltip title="Like">
                    <Button
                      shape="circle"
                      icon={<HeartOutlined />}
                      onClick={() => handleLike(item)}
                    />
                  </Tooltip>
                  <Tooltip title="Add to Cart">
                    <Button
                      shape="circle"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(item)}
                    />
                  </Tooltip>
                </div>
              </div>
            }
          >
            <h2 className="text-gray-900 font-semibold text-[20px]">
              {item.title}
            </h2>
            <p className="text-gray-700">{item.company_name}</p>
            <p className="text-gray-700">{item.price} UZS</p>
            <p className="text-gray-700">{item.volume} L</p>
            <p className="text-gray-700">{item.type}</p>

            <div className="mt-4">
              <Rate allowHalf defaultValue={0} />
            </div>

            <div className="mt-4 flex gap-2">
              <Popconfirm
                title="Delete the product"
                description="Are you sure to delete this product?"
                onConfirm={() => handleDelete(item.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
              <Button onClick={() => handleEdit(item)}>Edit</Button>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <Modal
          title={`${editItem ? "Update" : "Create"} Product`}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={false}
        >
          <Form
            name="productForm"
            initialValues={editItem}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="space-y-2"
          >
            <Form.Item
              label="Product Name"
              name="title"
              rules={[{ required: true, message: "Product nomini kiriting" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Company Name"
              name="company_name"
              rules={[{ required: true, message: "Company nomini kiriting" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Narxini kiriting" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Volume"
              name="volume"
              rules={[{ required: true, message: "Hajmini kiriting" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Turini tanlang" }]}
            >
              <Radio.Group>
                <Radio value="Gazli">Gazli</Radio>
                <Radio value="Gazsiz">Gazzsiz</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Image Link"
              name="image"
              rules={[{ required: true, message: "Rasm linkini kiriting" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                loading={createLoading}
                className="w-full"
                type="primary"
                htmlType="submit"
              >
                {editItem ? "Update" : "Create"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default Products;
