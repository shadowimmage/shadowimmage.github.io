
// This is a silly hack, but does what I wanted it to do:
// Cycles through a selection of phrases (hardcoded) at a (hardcoded) interval
// I really ought to make this dynamic if I ever use it anywhere else...

const postText = (textArr, target) => {
  let newElement = document.createElement('blockquote')
  let randIndex = Math.round(Math.random() * (textArr.length - 1))
  newElement.innerText = textArr[randIndex]
  while(target.lastChild) {
    target.removeChild(target.lastChild)
  }
  target.appendChild(newElement)
}

const setupCycler = () => {
  const element = document.getElementById('cyclerContainer')
  const text = [
    'Bot Factory;',
    'Aspiring Software Architect;',
    'Project Manager;',
    '3D Printer;',
    'Reverse Engineer;',
    'Optimistic Nihilist;',
    'Workflow Automator;',
    'Self Managed;',
    'Introvert;',
    'Data Analyzer;',
    'Developer;',
    'Engineer;',
    'Analyst;',
    'Polyglot;',
    'Natural Language Processor;',
  ]
  setInterval(() => postText(text, element), 5000);
}

document.addEventListener('DOMContentLoaded', setupCycler);