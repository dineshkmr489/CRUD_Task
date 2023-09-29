import React, { useEffect, useState } from "react";
import "./TableView.css";

const TableViewer = () => {
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/items")
      .then((val) => val.json())
      .then((item) => {
        if (item.data == "No products found") {
          setData([]);
          console.log(item.data);
        } else {
          setData(item.data);
          console.log(item);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };
  const handleEdit = (item) => {
    setEditedItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setIsEditModalOpen(true);
  };

  const handleNew = () => {
    setIsNewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsNewModalOpen(false);
    setEditedItem(null);
  };

  const handleUpdate = () => {
    const updatedItem = {
      ...editedItem,
      name: name,
      description: description,
      price: price,
    };

    fetch(`http://localhost:3000/api/items/${editedItem.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          handleRefresh();
        } else {
          alert(data.data);
        }

        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const handleCreate = () => {
    const newItem = {
      name: newName,
      description: newDescription,
      price: newPrice,
    };

    fetch("http://localhost:3000/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          handleRefresh();
        } else {
          alert(data.data);
        }

        setIsNewModalOpen(false);
        setNewName("");
        setNewDescription("");
        setNewPrice("");
      })
      .catch((error) => {
        console.error("Error creating new data:", error);
      });
  };

  const handleDelete = (item) => {
    fetch(`http://localhost:3000/api/items/${item.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          handleRefresh();
        } else {
          alert("Oops, Something Went Wrong");
        }
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  return (
    <>
      <div className="container">
        <div className="create_new">
          <button className="new-button" onClick={handleNew}>
            New
          </button>
        </div>
         
          <div className="tableviewer">
            <table>
              <tr className="table-header">
                <th>S.No</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
              {data &&
                data.map((item, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </table>
          </div>

          {isEditModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span onClick={handleCloseModal} className="close-modal">
                  &times;
                </span>
                <h2>Edit Item</h2>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    id="productName"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    id="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    id="price"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <button onClick={handleUpdate}>Update</button>
              </div>
            </div>
          )}

          {isNewModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span onClick={handleCloseModal} className="close-modal">
                  &times;
                </span>
                <h2>Create New Item</h2>

                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    placeholder="Price"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
                <div className="button_div">
                  <button onClick={handleCreate}>Create</button>
                </div>
              </div>
            </div>
          )}
        </div>
    </>
  );
};

export default TableViewer;
