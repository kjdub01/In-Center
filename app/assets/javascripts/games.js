$(() => {
  bindClickHandlers()
})

const bindClickHandlers = () => {
  $(document).on('click', "#unassigned", function(e) {
    e.preventDefault()
  history.pushState(null, null, "games/unassigned")
  getGames()
  })

  $(document).on('click', ".show_link", function(e) {
    e.preventDefault()
    $('#maincontent').html('')
    let id = ($(this).attr('data-id'))
    fetch(`/games/${id}.json`)
      .then(res => res.json())
      .then(game => {
        let newGame = new Game(game)
        let gameHTML = newGame.formatShow()
        $('#maincontent').append(gameHTML)
      })
  })

  $("#new_game.new_game").on("submit", function(e) {
    e.preventDefault()
    const values = $(this).serialize()

  $.post("/games", values).done(function(data) {
    $('#maincontent').html('')
    //$('#maincontent').html('<h1>This will be the new content</h1>')
    const newGame = new Game(data)
    const htmlToAdd = newGame.formatShow()

    $("#maincontent").html(htmlToAdd)
    })
  })

  $(document).on("click", ".user-games", function(e) {
    e.preventDefault()
    let baseUrl = window.location
    fetch(`${baseUrl}/games.json`)
      .then(res => res.json())
      .then(games =>  {
        console.log(games)
        //$('#data-area').html('')
        //games.forEach(game => {
          //let newGame = new Game(game)
          //let gameHTML = newGame.formatUserIndex()
          //$('#data-area').append(gameHTML)
        //})
      })
  })
}

const getGames = () => {
  fetch('/games/unassigned.json')
    .then(res => res.json())
    .then(games => {
      $('#maincontent').html('')
      games.forEach(game => {
        let newGame = new Game(game)
        let gameHTML = newGame.formatIndex()
        $('#maincontent').append(gameHTML)
      })
    })
}

function Game(game) {
  this.id = game.id
  this.starts_at = game.starts_at
  this.team1 = game.teams[0].team_name
  this.team2 = game.teams[1].team_name
  this.venue = game.teams[0].address1
  this.user = game.user
}

Game.prototype.formatIndex = function() {

  let gameHTML = `
  <h3>Match</h3>
    <h4><a href="/games/${this.id}" data-id="${this.id}" class="show_link"><h1>${this.starts_at}</a></h4>
    <h4>${this.team1} vs. ${this.team2}</h4>
    <h4>Venue: ${this.venue}</h4>
  `
  return gameHTML
}

Game.prototype.formatShow = function() {
  let gameHTML = `
    <h1>${this.team1} vs ${this.team2}</h1>
  `
  return gameHTML
}

Game.prototype.formatUserIndex = function() {

  let gameHTML = `
    <table>
      <tbody>
      <tr>
        <td>Date</td>
        <td>Time</td>
        <td>Home Team</td>
        <td>Away Team</td>
        <td>Appointment</td>
      </tr>
      <tr>
        <td>${this.starts_at}</td>
        <td>${this.starts_at}</td>
        <td>${this.team1}</td>
        <td>${this.team2}</td>
        <td>${this.user}</td>
      </tr>
      </tbody>
    </table>
  `
}
