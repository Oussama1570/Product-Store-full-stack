import React, { useEffect } from 'react'
import InputField from '../addProduct/InputField'
import SelectField from '../addProduct/SelectField'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../redux/features/products/productsApi';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseURL';

const UpdateProduct = () => {
  const { id } = useParams();
  const { data: productData, isLoading, isError, refetch } = useFetchProductByIdQuery(id);
  // console.log(productData)
  const [updateProduct] = useUpdateProductMutation();
  const { register, handleSubmit, setValue, reset } = useForm();
  useEffect(() => {
    if (productData) {
      setValue('title', productData.title);
      setValue('description', productData.description);
      setValue('category', productData?.category);
      setValue('trending', productData.trending);
      setValue('oldPrice', productData.oldPrice);
      setValue('newPrice', productData.newPrice);
      setValue('coverImage', productData.coverImage)
    }
  }, [productData, setValue])

  const onSubmit = async (data) => {
    const updateProductData = {
      title: data.title,
      description: data.description,
      category: data.category,
      trending: data.trending,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      coverImage: data.coverImage || productData.coverImage,
    };
    try {
      await axios.put(`${getBaseUrl()}/api/products/edit/${id}`, updateProductData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      Swal.fire({
        title: "Product Updated",
        text: "Your product is updated successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!"
      });
      await refetch()
    } catch (error) {
      console.log("Failed to update product.");
      alert("Failed to update product.");
    }
  }
  if (isLoading) return <Loading />
  if (isError) return <div>Error fetching product data</div>
  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Product</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Title"
          name="title"
          placeholder="Enter product title"
          register={register}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="Enter product description"
          type="textarea"
          register={register}
        />

        <SelectField
          label="Category"
          name="category"
          options={[
            { value: '', label: 'Choose A Category' },
            { value: 'business', label: 'Business' },
            { value: 'technology', label: 'Technology' },
            { value: 'fiction', label: 'Fiction' },
            { value: 'horror', label: 'Horror' },
            { value: 'adventure', label: 'Adventure' },
          ]}
          register={register}
        />
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register('trending')}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
          </label>
        </div>

        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
        />

        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
          register={register}
        />

        <InputField
          label="Cover Image URL"
          name="coverImage"
          type="text"
          placeholder="Cover Image URL"
          register={register}
        />

        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-md">
          Update Product
        </button>
      </form>
    </div>
  )
}

export default UpdateProduct