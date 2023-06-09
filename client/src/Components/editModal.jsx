import { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import dayjs from "dayjs";
import {Component} from "../Page";
import modalContext from "../Context/modalContext";
import PropTypes from 'prop-types';

EditModal.propTypes = {
  newMode: PropTypes.func.isRequired,
  content : PropTypes.object.isRequired
};

export function EditModal(props) {
  let { newMode } = props;
  let { addPage, modifyPage , nextId , setNextId , deletePage} = useContext(modalContext);
  const [editmode, setEditmode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [showEdit, setShowEdit] = useState(false);
  const [tempContent, setTempContent] = useState(new Component("", ""));

  const handleClose = () => setShowEdit(false);
  const handleShow = () => setShowEdit(true);
  function handlePublishDate(event) {
    setTempContent(
      (tempContent) =>
        (tempContent = Object.assign({}, tempContent, {
          publishDate: dayjs(event.target.value),
        }))
    );
  }
  function handleType(event) {
    setTempContent(
      (tempContent) =>
        (tempContent = Object.assign({}, tempContent, {
          componentType: event.target.value,
        }))
    );
  }
  function handleData(event) {
    console.log(event)
    setTempContent(
      (tempContent) =>
        (tempContent = Object.assign({}, tempContent, {
          componentData: event.target.value ,
        }))
    );
  }
  function handleEdit() {
    setEditmode(true);
    const { content } = props;
    setTempContent((tempContent) => Object.assign(tempContent, content));
    handleShow();
  }
  function handleCreation() {
    setEditmode(false);
    setTempContent(Object.assign({}, { id: nextId }));
    handleShow();
  }
  function handleRemove() {
    deletePage(tempContent);
    handleClose();
  }
  function handleSubmit() {
    if (!tempContent.title || tempContent.title == "" || !tempContent.title.trim()) {
      setErrorMessage("Titolo non valido !");
      return;
    } else {
      setErrorMessage("");
    }
    if (editmode) {
      modifyPage(tempContent);
      handleClose();
    } else {
      addPage(tempContent);
      setNextId((id) => id + 1);
      setTempContent(Object.assign({}, { id: nextId }));
      handleClose();
    }
  }

  return (
    <>
      {newMode ? (
        <Button variant="outline-success" onClick={handleCreation}>
          Add new Component
        </Button>
      ) : (
        <Button variant="white" onClick={handleEdit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            className={"bi bi-pencil-fill"}
            viewBox="0 0 16 16"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
          </svg>
        </Button>
      )}
      <Modal show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Component Management</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              {/*Form type is a dropdown list that contains Image , Body and Header  */}
              <Form.Label>Type: </Form.Label>
              <Form.Select
                value={tempContent.componentType}
                onChange={handleType}
                >
                <option value="Body">Body</option>
                <option value="Header">Header</option>
                <option value="Image">Image</option>
                
                </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Publish Date : </Form.Label>
              <Form.Control
                type="date"
                name="publishDate"
                value={
                  tempContent.date != null
                    ? dayjs(tempContent.date).format("YYYY-MM-DD")
                    : ""
                }
                onChange={handlePublishDate}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content: </Form.Label>
              {(tempContent.componentType !== "Image")?
              <Form.Control
                type="textArea"
                name="componentData"
                value={tempContent.componentData}
                onChange={handleData}/>
              :
                <Form.Select
                value={tempContent.componentData}
                onChange={handleData}
                >
                <option value="faro.jpeg">Faro</option>
                  <option value="cane.jpeg">Cane</option>
                </Form.Select>
              }
              
            </Form.Group>
          </Form>
          {errorMessage != "" ? (
            <Alert key={"danger"} variant={"danger"}>
              {" "}
              {errorMessage}{" "}
            </Alert>
          ) : (
            false
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {!newMode && <Button variant="danger" onClick={handleRemove}>
            DELETE
          </Button>}
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
