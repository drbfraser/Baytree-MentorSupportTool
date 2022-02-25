
function clicked() {
  fetch('http://localhost:8000/records/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    .then(response => response.json())
}

const Records= () => {
  
    return (
      <div>
        <h3>Records</h3>
        <button onClick={clicked}>Button</button>
      </div>
    )
  };
  
  export default Records;
