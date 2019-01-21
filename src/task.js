import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  border-bottom: 1px solid rgb(204, 204, 204);

  border-radius: 3px;
  padding: 10px;
  margin-bottom: 8px;
  background-color: white;
  display: flex;
  flex-direction: column;
  max-width: 260px;

  &:hover {
    background-color: rgb(240, 240, 240);
    color: rgb(0, 0, 0);
    cursor: pointer;
  }
`;

const CandidateName = styled.p`
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid rgb(238, 238, 238);
  padding-bottom: 5px;
  color: rgb(0, 0, 0);
`;

const CandidateEmail = styled.p`
  color: rgb(77, 77, 77);
  white-space: normal;
`;

export default class Task extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <CandidateName>{this.props.task.name}</CandidateName>
            <CandidateEmail>{this.props.task.email}</CandidateEmail>
          </Container>
        )}
      </Draggable>
    );
  }
}
