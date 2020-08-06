import React from 'react';
import FormInputName from '../FormInputName/FormInputName.jsx';
import TestTrafficLawsData from '../../TestTrafficLawsData/questions.json';
import { sessionSaver } from '../../SessionSaver.js';
import getTickets from '../../utils/getTickets.js';
import Answers from './Answers.jsx';
import './TestTrafficLaws.css';
import Result from '../Result/Result.jsx';

export default class TestTrafficLaws extends React.Component {
  state = {
    isSubmitted: false,
    tickets: [],
    indexOfTicket: 0,
    falseAnswers: [],
  }

  componentDidMount() {
    const tickets = getTickets(TestTrafficLawsData);
    console.log(tickets);
    this.setState({ tickets });
  }

  handleSubmit = (value) => {
    const { isSubmitted } = this.state;
    sessionSaver.setUserName(value);
    this.setState({ isSubmitted: !isSubmitted });
  }

  chooseAnswer = (answer) => {
    const { indexOfTicket } = this.state;
    this.setState({ indexOfTicket: indexOfTicket + 1 });
    this.checkAnswer(answer + 1, indexOfTicket);
  }

  checkAnswer = (answerNumber, indexOfTicket) => {
    const { tickets, falseAnswers } = this.state;
    const trueAnswer = Number(tickets[indexOfTicket].correct);
    if (trueAnswer !== answerNumber) {
      this.setState({ falseAnswers: [...falseAnswers, {
        ticketNumber: indexOfTicket,
        answer: tickets[indexOfTicket].answers[answerNumber - 1],
        correct: tickets[indexOfTicket].answers[trueAnswer - 1],
      }] });
    }
  }

  getImage = () => {
    const { tickets, indexOfTicket } = this.state;
    const url = require(`../../TestTrafficLawsData/${tickets[indexOfTicket].image}`);
    return !tickets[indexOfTicket].image.includes('no_image.jpg')
        ? <img src={url} alt="изображение ситуации" /> : '';
  }

  startTest = () => {
    const tickets = getTickets(TestTrafficLawsData);
    this.setState({ tickets, indexOfTicket: 0, falseAnswers: [] });
  }

  renderQuiz = () => {
    const { tickets, indexOfTicket, falseAnswers } = this.state;
    return (
      indexOfTicket <= 19
        ? (
          <div className="container margin-top-50">
            {this.getImage()}
            <h2>
              {tickets[indexOfTicket].title}
            </h2>
            <div>
              <Answers
                answers={tickets[indexOfTicket].answers}
                chooseAnswer={this.chooseAnswer}
                hint={tickets[indexOfTicket].hint}
              />
            </div>
          </div>
        ) : <Result
              falseAnswers={falseAnswers}
              startTest={this.startTest}
              tickets={tickets}
            />
    );
  }

  render() {
    const { isSubmitted } = this.state;
    return (
      isSubmitted
        ? this.renderQuiz()  : <FormInputName onSubmit={this.handleSubmit} />
    );
  }
}