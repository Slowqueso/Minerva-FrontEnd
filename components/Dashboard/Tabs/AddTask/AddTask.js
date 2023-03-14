import React, { useState } from 'react';
import styles from './styles.module.css';
import TextBox from '../../../form/textBox';
import TextArea from '../../../form/TextArea';
import SelectMenu from '../../../form/SelectMenu';
import SubmitButton from '../../../form/SubmitButton';

const AddTask = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescripton, setTaskDescription] = useState("");
  const [taskCredit, setTaskCredit] = useState("");
  const [taskAmountInD, setAmountInD] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  const handleAddTask = () => {
    console.log(taskTitle);
  };

  return (
    <div className={styles.add_task}>
      <div className={styles.add_task_container}>
        <form>
          <div className="flex">
            <SelectMenu
              label={"Username"}
              objectArray={[]}
              name={"assignee"}
              changeHandler={setSelectedUser}
            ></SelectMenu>
          </div>
          <div className="flex">
            <TextBox
              label={"Task Title"}
              name={"taskTitle"}
              inputUpdate={setTaskTitle}
              value={taskTitle}
            ></TextBox>
          </div>
          <div className="flex">
            <TextArea
              label={"Task Description"}
              name={"taskDescription"}
              inputUpdate={setTaskDescription}
              value={taskDescripton}
            ></TextArea>
          </div>
          <div className={styles.byTwo}>
            <TextBox
              label={"Task Credit"}
              name={"taskCredit"}
              inputUpdate={setTaskCredit}
              value={taskCredit}
            ></TextBox>
            <TextBox
              label={"Amount"}
              name={"amount"}
              inputUpdate={setAmountInD}
              value={taskAmountInD}
            ></TextBox>
          </div>
          <div className="flex">
            <TextBox
              label={"Due Date"}
              name={"dueDate"}
              inputUpdate={setTaskDueDate}
              value={taskDueDate}
            ></TextBox>
          </div>
          <div className={styles.btnTask}>
            <SubmitButton
              label={"Add Task"}
              submitHandler={handleAddTask}
            ></SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTask