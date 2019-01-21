import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@atlaskit/css-reset";
import "../src/index.css";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import axios from "axios";
import API from "./api";
import Column from "./column";

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = {
    candidates: {},
    columnOrder: [],
    columns: {}
  };

  componentDidMount() {
    axios
      .all([
        API.get("/candidates"),
        API.get("/columnOrder"),
        API.get("/columns")
      ])
      .then(
        axios.spread((candidatesRes, columnOrderRes, columnsRes) => {
          const candidates = candidatesRes.data;
          const columnOrder = columnOrderRes.data;
          const columns = columnsRes.data;
          this.setState({ candidates, columnOrder, columns });
        })
      );
  }

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      };

      this.setState(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };
    this.setState(newState);
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
          {this.state.columnOrder.map(columnId => {
            const column = this.state.columns[columnId];
            const candidates = column.taskIds.map(
              taskId => this.state.candidates[taskId]
            );

            return (
              <Column key={column.id} column={column} candidates={candidates} />
            );
          })}
        </Container>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
