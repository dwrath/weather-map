class WeatherCard{
    constructor(data, target) {
        this.high = data.high
        this.low = data.low
        this.day = data.dayOfWeek
        this.img = data.img
        this.desc = data.description
        this.element = this.render(target);
    }
    render(target){
        let weatherNode = document.createElement('div');
        weatherNode.classList.add('weather-card');
        let html = `
              <div class="img-wrapper">
                <img src="${this.img}" />
              </div>
              <div class="card-bottom">
                <h2>${this.day}</h2>
                <p class="high-low">High: ${this.high} Low: ${this.low}</p>
                <p>${this.desc.charAt(0).toUpperCase() + this.desc.slice(1)}</p>
              </div>
        `;
        weatherNode.innerHTML = html;
        target.appendChild(weatherNode);
        return weatherNode;
    }
}
export default WeatherCard;