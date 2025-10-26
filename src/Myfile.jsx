import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { FaSearch, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Myfile = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const productCollection = collection(db, "products");

  // Real-time fetching
  useEffect(() => {
    const q = query(productCollection);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setProducts(data);
      setFilteredProducts(data);
    });
    return () => unsubscribe();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  // Open modal (Add or Edit)
  const openModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setName(product.name);
      setPrice(product.price);
    } else {
      setSelectedProduct(null);
      setName("");
      setPrice("");
    }
    setShowModal(true);
  };

  const clearModal = () => {
    setSelectedProduct(null);
    setName("");
    setPrice("");
    setShowModal(false);
  };

  // Add or Update product
  const handleSubmit = async () => {
    if (!name || !price) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      if (selectedProduct) {
        // Update
        await updateDoc(doc(db, "products", selectedProduct.id), {
          name,
          price: Number(price),
        });
       toast.info("Product updated successfully!", { className: "Toastify__toast--update" });
      } else {
        // Add
        await addDoc(productCollection, { name, price: Number(price) });
        toast.success("Product added successfully!", { className: "Toastify__toast--add" });
      }
      clearModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product!");
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteDoc(doc(db, "products", selectedProduct.id));
     toast.warn("Product deleted successfully!", { className: "Toastify__toast--delete" });
      clearModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product!");
    }
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 bg-white p-2 rounded-4xl text-blue-600">
          🛍️ ତେଜରାତି ବିକ୍ରୟ ମୂଲ୍ୟ
        </h2>

        {/* Add & Search */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add
          </button>
          <div className="relative ">
            <input
              type="text"
              placeholder="Search by ତେଜରାତି ନାମ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-8 py-2 rounded-lg bg-white"
            />
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className=" rounded-lg overflow-hidden bg-white shadow">
          {/* Header */}
          <div className="grid grid-cols-2 text-center items-center bg-blue-500 text-white font-semibold border-b border-gray-300 "   >
            <div className="border-r border-gray-300 flex items-center justify-center " style={{ minHeight: "50px" }}>ତେଜରାତି ନାମ</div>
            <div className="flex items-center justify-center" style={{ minHeight: "50px" }}>Price</div>
          </div>

          {/* Rows */}
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
              onClick={() => openModal(p)}
              style={{ minHeight: "50px" }} // ensures uniform row height
            >
              {/* Product Name Column */}
              <div className="text-black  pl-5 border-b border-gray-300 flex items-center">
                {p.name}
              </div>

              {/* Price Column */}
              <div className="flex items-center font-semibold justify-center border-l text-red-600 border-gray-300">
                ₹{p.price}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[350px] relative">
            <button
              onClick={clearModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-semibold text-center mb-4">
              {selectedProduct ? "Edit Product" : "Add Product"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1  text-black font-semibold">
                  ତେଜରାତି ନାମ
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block mb-1  text-black font-semibold">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg bg-gray-50"
                />
              </div>

              <div className="flex justify-between gap-2">
                {/* Add or Update */}
                <button
                  onClick={handleSubmit}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-200 text-white ${selectedProduct ? "bg-blue-600 hover:bg-blue-700" : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                  {selectedProduct ? "Update" : "Add"}
                </button>

                {/* Delete */}
                {selectedProduct && (
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Delete
                  </button>
                )}

                {/* Cancel */}
                {/* <button
                  onClick={clearModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancel
                </button> */}
              </div>


            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myfile;
