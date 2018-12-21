const attendees = document.querySelector("#attendees");


fetch("https://jsonplaceholder.typicode.com/users")
  .then(response => response.json())
  .then(function(data) {
    let html = "";
    data.forEach(function(user) {
      html += `<div class="card">
      <h2>${user.name}</h2>
      <div>${user.email}</div>
      </div>
      `;
    });
    attendees.innerHTML = html;
  });