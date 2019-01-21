import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import axios from "axios";

import Task from "./task";

const Container = styled.div`
  margin: 10px;
  padding: 5px;
  background-color: rgb(227, 227, 227);
  border-radius: 2px;
  min-width: 280px;

  display: flex;
  flex-direction: column;

  &:last-child {
    background-color: lightblue;
  }
`;
const Title = styled.h3`
  padding: 8px;
  font-weight: bold;
`;
const TaskList = styled.div`
  padding: 8px;
  flex-grow: 1;
  min-height: 100px;
`;

const AddNewCandidate = styled.a`
  color: #6b808c;
  text-align: center;
  text-decoration: none;
  padding: 5px;
  border-radius: 3px;
  &:hover {
    cursor: pointer;
    text-decoration: none;
    background-color: rgba(9, 45, 66, 0.13);
    color: #17394d;
    text-decoration: underline;
  }
`;

export default class Column extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      candidateName: "",
      candidateEmail: "",
      candidateAddress: "",
      candidateAge: ""
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSumbit = evt => {
    const candidateCount = Object.keys(this.props.candidates).length + 1;
    const candidateDetails = {
      id: `candidate-${candidateCount}`,
      name: this.state.candidateName,
      age: this.state.candidateAge,
      email: this.state.candidateEmail,
      image: "someimage"
    };
    axios
      .post("http://localhost:3000/candidates", { candidateDetails })
      .then(res => {
        if (res >= 200 && res < 300) {
          alert("new candidate added!");
        } else {
          alert("Something went wrong: " + res);
          console.log("Status code for adding new user: " + res);
        }
      });
  };

  handleChangeInput = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  onKeyPress = evt => {
    if (evt.which === 13) {
      evt.preventDefault();
    }
  };

  render() {
    return [
      <Container>
        <Title>{this.props.column.title}</Title>
        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <TaskList ref={provided.innerRef} {...provided.droppableProps}>
              {this.props.candidates.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
        {this.props.column.title === "Kontakt" ? (
          <AddNewCandidate onClick={this.toggle}>
            + Lägg till en kandidat
          </AddNewCandidate>
        ) : null}
      </Container>,
      <div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            <h3>Lägg till en ny kandidat</h3>
          </ModalHeader>
          <ModalBody>
            <Form onKeyPress={this.onKeyPress} onSubmit={this.handleSumbit}>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="candidateName">Name</Label>
                    <Input
                      type="Name"
                      name="candidateName"
                      id="candidateName"
                      onChange={this.handleChangeInput}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="candidateEmail">Email</Label>
                    <Input
                      type="email"
                      name="candidateEmail"
                      id="candidateEmail"
                      onChange={this.handleChangeInput}
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="candidateAddress">Adress</Label>
                    <Input
                      type="Address"
                      name="candidateAddress"
                      id="candidateAddress"
                      onChange={this.handleChangeInput}
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="candidateAge">Ålder</Label>
                    <Input
                      type="Age"
                      name="candidateAge"
                      id="candidateAge"
                      onChange={this.handleChangeInput}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Button size="lg" block className="btn-success" type="submit">
                Lägg till
              </Button>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>
              Spara
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Avbryt
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    ];
  }
}
