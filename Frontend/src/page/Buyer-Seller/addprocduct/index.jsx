import { useEffect, useState } from "react";
import Header from "../../../component/header";
import api from "../../../config/axios";
import Footer from "../../../component/footer";
import SlidebarSeller from "../../../component/slidebar-seller";
import { Button, Form, Image, Input, InputNumber, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import uploadFile from "../../../utils/upload";
import { useNavigate } from "react-router-dom";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddProduct = () => {
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [listImage, setListImage] = useState([]); // Mảng chứa các URL hình ảnh
  const navigate = useNavigate();

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      // Upload tất cả hình ảnh và lấy URLs
      const imageUploadPromises = fileList.map((file) =>
        uploadFile(file.originFileObj)
      );
      const uploadedImages = await Promise.all(imageUploadPromises);

      console.log("Uploaded Image Links:", uploadedImages);

      const Email = sessionStorage.getItem("email");
      console.log(Email);

      // Tạo payload để gửi lên server
      const productData = {
        sellerEmail: Email,
        productName: values.name,
        freshnessDuration: values.freshness_duration,
        comboType: values.combo_type,
        quantity: 1,
        price: values.price,
        description: values.description,
        category: values.category,
        createdAt: new Date().toISOString(),
        listImage: uploadedImages,
      };

      // kiểm tra dữ liệu sản phẩm
      console.log("Product Data:", productData);

      // Gọi API để thêm sản phẩm
      const response = await api.post("Product/CreateProduct", productData);
      if (response.data == true) {
        toast.success("Add Product success");
        form.resetFields(); // Reset form sau khi thêm thành công
        setFileList([]); // Reset file list
        setListImage([]); // Reset listImage
        navigate("/post-seller");
      } else {
        toast.error("Add Product failed");
      }
    } catch (error) {
      toast.error("Add Product failed");
      console.error(
        "Error adding product:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div>
      <Header />

      <div className="flex mt-[50px]">
        <SlidebarSeller />

        <div className="mt-[20px]">
          <div className="text-3xl font-semibold ml-[450px]">ADD PRODUCT</div>

          <Form
            className="form mt-[20px] ml-[100px]"
            labelCol={{
              span: 24,
            }}
            form={form}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Product Name"
              name="name"
              className="w-[500px]"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input
                type="text"
                placeholder="Product Name"
                className="px-3 py-2 border border-gray-800 w-[900px] h-[50px]  text-base"
              />
            </Form.Item>

            <Form.Item
              label="Freshness Duration"
              name="freshness_duration"
              className="w-[500px] "
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời hạn của sản phẩm!",
                },
              ]}
            >
              <div className="flex ">
                <div>
                  <InputNumber
                    placeholder="Freshness Duration"
                    className=" py-2 border border-gray-800 w-[900px]  text-base"
                  />
                </div>

                <div className="ml-[10px] mt-[10px] text-xl">DAY(S)</div>
              </div>
            </Form.Item>

            <Form.Item
              label="Combo Type"
              name="combo_type"
              className="w-[900px]"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn loại combo của sản phẩm!",
                },
              ]}
            >
              <Select placeholder="Select Combo Type" className="h-[50px]">
                <Select.Option value="Event">Event</Select.Option>
                <Select.Option value="Batch">Batch</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              ]}
            >
              <div className="flex">
                <div>
                  <InputNumber
                    placeholder="Price"
                    className="px-3 py-2 border border-gray-800 w-[900px] h-[50px] text-base"
                    min={0}
                  />
                </div>

                <div className="ml-[10px] mt-[10px] text-xl">VNĐ</div>
              </div>
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              className="w-[900px] "
              rules={[
                { required: true, message: "Vui lòng nhập loại của sản phẩm!" },
              ]}
            >
              <Select placeholder="Select Category" className="h-[50px]">
                <Select.Option value="Wedding">Wedding</Select.Option>
                <Select.Option value="Birthday">Birthday</Select.Option>
                <Select.Option value="Conference">Conference</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              className="w-[900px]"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả của sản phẩm!",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Description"
                className="px-3 py-2 border border-gray-800 w-[900px] text-base"
              />
            </Form.Item>

            <Form.Item label="Imagine Product" name="image">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 4 ? null : uploadButton}
              </Upload>
            </Form.Item>

            <Form.Item>
              <div className="flex justify-center w-full mt-[30px]">
                <Button
                  className="bg-white text-black border border-gray-800 font-light px-8 py-2 text-lg rounded-[18px] w-[150px] h-[40px] ml-[-150px]"
                  type="primary"
                  htmlType="submit"
                >
                  Add Product
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>

      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
      <Footer />
    </div>
  );
};

export default AddProduct;
