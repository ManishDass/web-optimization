let button = document.getElementById('minify-button')
button.addEventListener('click',(e)=>{
  
  let input = document.getElementById('input').value
  let output = document.getElementById('output')

    let test = input.replace(/\n/g, "")
    .replace(/[\t ]+\</g, "<")
    .replace(/\>[\t ]+\</g, "><")
    .replace(/\>[\t ]+$/g, ">");

    output.innerText = test
})