import React from "react"
import Confetti from "react-confetti"
import {useNavigate} from 'react-router-dom';

export default function CrackyEndless() {
  const navigate = useNavigate();

  // only allow one digit input 
  function checkNumberFieldLength(elem) {
    elem.target.value = elem.target.value.replaceAll("[^0-9]")
    if (elem.target.value.length > 1) {
      elem.target.value = elem.target.value.slice(0,1); 
    }
  }

  const [inputValues, setInputValues] = React.useState(
    {
        firstInput: "",
        secondInput: "",
        thirdInput: "",
        fourthInput: "",
        birdsValue: "?",
        beesValues: "?",
        disabledFlag: false
    }
  )

  const handleChange = index => event => {
    let newInputValues = [...inputRows]
    if (event.target.name === "firstInput") {
      newInputValues[index].inputValues.firstInput = event.target.value;
    } else if (event.target.name === "secondInput") {
      newInputValues[index].inputValues.secondInput = event.target.value;
    } else if (event.target.name === "thirdInput") {
      newInputValues[index].inputValues.thirdInput = event.target.value;
    } else {
      newInputValues[index].inputValues.fourthInput = event.target.value;
    }
    setInputValues(newInputValues)
  }

  const handleKeyUp = event => {
    const inputNameList = ["firstInput", "secondInput", "thirdInput", "fourthInput"]
    var ind = -1
    for (let i = 0; i < 4; i ++) {
      if (event.target.name === inputNameList[i]) {
        ind = i
      }
    }
    const nums = [0,1,2,3,4,5,6,7,8,9]
    if ((event.key in nums || event.key === "ArrowRight") && ind < 3) {
      // go to next input
      document.querySelector(`input:not([disabled])[name=${inputNameList[ind+1]}]`).focus();
    } else if ((event.key === "Backspace" || event.key === "ArrowLeft") && ind > 0) {
      // go to previous input
      document.querySelector(`input:not([disabled])[name=${inputNameList[ind-1]}]`).focus();
    } else if (event.key === "Enter") {
      crackButton()
    }
  }

  const [inputRows, setInputRows] = React.useState([{inputValues}])

  const [codeAnswer, setCodeAnswer] = React.useState();
  // generate random answer
  function generateAnswer() {
    var temp = [];
    while (temp.length < 4) {
        var n = Math.floor(Math.random() * 10);
        if (!temp.includes(n) && n !== "") {
            temp.push(n);
        }
    }
    let answer = Number(temp.join(""));
    setCodeAnswer(answer);
  }

  React.useEffect(() => {
    generateAnswer()
  }, [])

  function calculateBirdsBeesCount() {
    // get values from input
    const inputList = [
      inputRows[inputRows.length-1].inputValues.firstInput, 
      inputRows[inputRows.length-1].inputValues.secondInput, 
      inputRows[inputRows.length-1].inputValues.thirdInput, 
      inputRows[inputRows.length-1].inputValues.fourthInput
    ]
    if (inputList.includes("") || inputList.includes(undefined)) {
      alert("Please fill in all digits!");
      return 1;
    }
    else if (new Set(inputList).size !== inputList.length) {
      alert("No duplicate digits!")
      return 1;
    }

    // set each value in inputList to Number
    for (let i = 0; i < 4; i++) {
      inputList[i] = Number(inputList[i])
    }
    
    var birdCount = 0;
    var beeCount = 0;
    var codeAnswerList = Array.from(String(codeAnswer), Number);

    for (let i = 0; i < 4; i++) {
      if (inputList[i] === codeAnswerList[i]) {
        // correct number, correct position
        birdCount += 1;
      } else if (codeAnswerList.includes(inputList[i])) {
        // correct number, incorrect position
        beeCount += 1;
      }
    }

    let newInputValues = [...inputRows];
    newInputValues[inputRows.length-1].inputValues.birdsValue = birdCount;
    newInputValues[inputRows.length-1].inputValues.beesValues = beeCount;
    setInputValues(newInputValues);

    if (birdCount === 4) {
      return 2;
    }
  }


  // track number of guesses
  const [guessCount, setGuessCount] = React.useState(1)

  // win condition
  const [cracked, setCracked] = React.useState(false)

  // track give up 
  const [giveUpFlag, setGiveUpFlag] = React.useState(false)

  function winner() {
    inputRows[inputRows.length-1].inputValues.disabledFlag = true
    setCracked(true)
    guessCount > 1 ? alert(`YOU CRACKED IT IN ${guessCount} GUESSES!`) : alert(`YOU CRACKED IT IN ${guessCount} GUESS!`)
  }

  function refreshPage() {
    window.location.reload();
  }

  function crackButton() {
    // new game button
    if (cracked || giveUpFlag) {
      refreshPage();
      return;
    } 

    setGuessCount(guessCount + 1)
    const birdsBeesCount = calculateBirdsBeesCount();

    if (birdsBeesCount === 1) {
      // error thrown
      return;
    } else if (birdsBeesCount === 2) {
      // winner
      winner();
      return;
    }

    inputRows[inputRows.length-1].inputValues.disabledFlag = true
    setInputRows(prevInputRows => {
      return [...prevInputRows, {inputValues}]
    })
  }

  function handleGiveUp() {
    if (giveUpFlag) {
      return;
    }
    setGiveUpFlag(true);

    // scroll to bottom of page
    window.scrollTo(0, document.body.scrollHeight);

    // disable last row
    inputRows[inputRows.length-1].inputValues.disabledFlag = true
  }

  const modal = document.querySelector("#modal");
  const openModal = document.querySelector("#helpButton");
  const closeModal = document.querySelector("#closeModal");

  if (modal) {
    openModal &&
      openModal.addEventListener("click", () => modal.showModal());

    closeModal &&
      closeModal.addEventListener("click", () => modal.close());
  }

  return (
    <div>
      {cracked && <Confetti height={document.documentElement.offsetHeight}/>}
      <div className="nav-bar">
        <button id="crackyHomeButton" onClick={() => navigate("/")}>CRACKY Home</button>
        <button id="playAgainButton" type="button" onClick={refreshPage}>New CRACK</button>
        <button id="giveUpButton" type="button" onClick={handleGiveUp}>Give up CRACK</button>

        <button id="helpButton">Help</button>
        <dialog id="modal" className="dialog">
          <button id="closeModal" className="dialog-close-btn">Close</button>
          <h2>How to CRACK</h2>
          <h4>Crack the code in the least number of guesses!</h4>
          - The number of birds and bees will be given to show how close your guess was to the code.<br></br>
          - Birds = correct digit, correct position <br></br>
          - Bees = correct digit, incorrect position <br></br>
          <h4>Examples</h4>
          <p>2834 = 1 birds, 0 bees <br></br>
          1 of these digits is correct and in the correct position. </p>
          <p>5107 = 2 birds, 2 bees <br></br>
          2 of these digits are correct and in the correct position, and the other 2 digits are correct but in the incorrect position.</p>
          <p>9638 = 0 birds, 1 bees <br></br>
          1 of these digits is correct and in the incorrect position.</p>
        </dialog>
      </div>

      {/* title */}
      <div className="title-label">
        <h1>CRACKY</h1>
        <h3>-endless-</h3>
      </div>

      {/* disabled row */}
      <div className="row">
        <div className="input-row">
          <input type="number" className="input-value" disabled/>
          <input type="number" className="input-value" disabled/>
          <input type="number" className="input-value" disabled/>
          <input type="number" className="input-value" disabled/>
        </div>
        <div className="birds-bees-row">
          <label className="birds">birds</label>
          <label className="bees">bees</label>
        </div>
      </div>

      {/* main game */}
      {inputRows.map((row, index) => {
        return (
          <div className="row" key={index}>
            <div className="input-row">
              <input 
                type="number" 
                className="input-value" 
                onInput={checkNumberFieldLength} 
                onChange={handleChange(index)} 
                onKeyUp={handleKeyUp}
                name="firstInput"
                value={row.inputValues.firstInput || ''}
                disabled={row.inputValues.disabledFlag}
                autoFocus
              />
              <input 
                type="number" 
                className="input-value" 
                onInput={checkNumberFieldLength} 
                onChange={handleChange(index)} 
                onKeyUp={handleKeyUp}
                name="secondInput"
                value={row.inputValues.secondInput || ''}
                disabled={row.inputValues.disabledFlag}
              />
              <input 
                type="number" 
                className="input-value" 
                onInput={checkNumberFieldLength} 
                onChange={handleChange(index)} 
                onKeyUp={handleKeyUp}
                name="thirdInput"
                value={row.inputValues.thirdInput || ''}
                disabled={row.inputValues.disabledFlag}
              />
              <input 
                type="number" 
                className="input-value" 
                onInput={checkNumberFieldLength} 
                onChange={handleChange(index)} 
                onKeyUp={handleKeyUp}
                name="fourthInput"
                value={row.inputValues.fourthInput || ''}
                disabled={row.inputValues.disabledFlag}
              />
            </div>
            <div className="birds-bees-row">
              <label className="birds">{row.inputValues.birdsValue}</label>
              <label className="bees">{row.inputValues.beesValues}</label>
            </div>
          </div>
        )
      })}

      {/* give up text */}
      {!cracked && giveUpFlag ? <p id="giveUpText">GAME OVER! The code is: {codeAnswer}</p> : ""}
      
      <br></br>
      {/* buttons */}
      <div className="buttons">
        <button id="crackButton" type="button" onClick={crackButton}>{cracked || giveUpFlag ? "New CRACK" : "CRACK!"}</button>
      </div>   
    </div>
  )
}