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
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

// Notification Component
const Notification = ({ message, type }) => {
  if (!message) return null;

  const styles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
  };

  return (
    <div
      className={`border px-4 py-3 rounded relative mb-4 ${styles[type]}`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

const Myfile = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  const productCollection = collection(db, "products");

  // Real-time fetching
  useEffect(() => {
    setLoading(true);
    const q = query(productCollection);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time data:", error);
        setNotification({ type: "error", message: "Could not fetch products." });
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Filter products on search
  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  // Notification auto-hide
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const clearForm = () => {
    setName("");
    setPrice("");
    setEditId(null);
  };

  // Add / Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      setNotification({ type: "error", message: "Please enter name and price." });
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        const docRef = doc(db, "products", editId);
        await updateDoc(docRef, { name, price: Number(price) });
        setNotification({ type: "success", message: "Product updated!" });
      } else {
        await addDoc(productCollection, { name, price: Number(price) });
        setNotification({ type: "success", message: "Product added!" });
      }
      clearForm();
    } catch (error) {
      console.error("Error adding/updating product:", error);
      setNotification({ type: "error", message: "Failed to save product." });
    }
    setLoading(false);
  };

  // Delete product
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const docRef = doc(db, "products", id);
      await deleteDoc(docRef);
      setNotification({ type: "success", message: "Product deleted." });
    } catch (error) {
      console.error("Error deleting product:", error);
      setNotification({ type: "error", message: "Failed to delete product." });
    }
    setLoading(false);
  };

  // Edit product
  const handleEdit = (product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
  };

  return (
    <div className="min-h-screen  py-3">
      <div className="max-w-3xl mx-auto p-6  rounded-lg ">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          🛍️ ତେଜରାତି ବିକ୍ରୟ ମୂଲ୍ୟ
        </h2>

        {/* Notification */}
        <Notification message={notification.message} type={notification.type} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex  sm:flex-row gap-3">
            <input
              type="text"
              placeholder="ତେଜରାତି ନାମ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />
            <input
              type="number"
              placeholder="ବିକ୍ରୟ ମୂଲ୍ୟ"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
              className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
                editId
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={clearForm}
                disabled={loading}
                className="w-1/3 px-4 py-2 rounded-lg text-white font-semibold bg-gray-500 hover:bg-gray-600 transition-colors duration-200 disabled:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Search */}
        <div className="mt-6 relative">
          <input
            type="text"
            placeholder="Search by ତେଜରାତି ନାମ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
        </div>

        {/* Product List */}
        <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-black text-white font-semibold text-center p-2">
            <div>ତେଜରାତି ନାମ</div>
            <div>Price</div>
            <div>Actions</div>
          </div>

          {/* List Body */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="text-center p-10 text-gray-500">
                <div className="text-2xl animate-spin">🌀</div>
                Loading...
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center p-10 text-gray-500">
                No products found.
              </div>
            )}

            {!loading &&
              filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-3 items-center text-center p-3 border-b border-gray-200 last:border-b-0 bg-white"
                >
                  <div className="font-semibold text-gray-800">{p.name}</div>
                  <div className="text-gray-700 font-medium">₹{p.price}</div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      disabled={loading}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm disabled:bg-gray-400"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={loading}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm disabled:bg-gray-400"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myfile;
