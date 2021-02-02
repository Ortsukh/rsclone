import React, { useLayoutEffect, useEffect } from "react";
import "./dashboard-page.scss";
import { Line, Bar } from "react-chartjs-2";
import { dashboardProps } from "../../constants/interfaces";
import { AVA_URL } from "../../constants/constants";
import { RU, EN } from "./langs";
import { getMainGameStatistic } from "../shadow-training-page/utils/statistic-utils";

function DashboardPage(props: dashboardProps) {
  const { isDarkTheme, isLanguageRU, settings, statistic } = props;

  const { optional } = statistic;
  const { optional: optionalSet } = settings;

  const { mainGameLong } = optional;
  const stats = getMainGameStatistic(mainGameLong);
  const {
    bestAll,
    rightPerDay,
    totalCards,
    userWordsPerDay,
    totalPoints,
    totalCorrectCards,
  } = stats;
  const { currentRightPerDay } = stats;
  const userNewWords = userWordsPerDay[0].value
    ? userWordsPerDay[userWordsPerDay.length - 1].value
    : 0;
  const {
    cardsPerDay,
    userLanguageLevel,
    createSettingsTimestamp,
  } = optionalSet;
  const dateUser = new Date(createSettingsTimestamp);

  const dateToday = new Date().getDay();
  console.log(dateToday);
  currentRightPerDay.value =
    dateToday === new Date(currentRightPerDay.date).getDay()
      ? currentRightPerDay.value
      : 0;

  function checkCase(num: any) {
    if (num.toString().slice(-1) === "1" && num.toString().slice(-2) !== "11") {
      return 0;
    }
    if (
      num.toString().slice(-1) > 1 &&
      num.toString().slice(-1) < 5 &&
      !["12", "13", "14"].includes(num.toString().slice(-2))
    ) {
      return 1;
    }
    return 2;
  }

  let UserLvlLang: string;
  switch (userLanguageLevel) {
    case 0:
      UserLvlLang = "A0";
      break;
    case 1:
      UserLvlLang = "A1";
      break;
    case 2:
      UserLvlLang = "A2";
      break;
    case 3:
      UserLvlLang = "B1";
      break;
    case 4:
      UserLvlLang = "B2";
      break;
    case 5:
      UserLvlLang = "C1";
      break;

    default:
      break;
  }

  let rangImgID: string;
  switch (true) {
    case totalPoints < 100:
      rangImgID = "00";
      break;
    case totalPoints < 220:
      rangImgID = "01";
      break;
    case totalPoints < 364:
      rangImgID = "02";
      break;
    case totalPoints < 537:
      rangImgID = "03";
      break;
    case totalPoints < 744:
      rangImgID = "04";
      break;
    case totalPoints < 993:
      rangImgID = "05";
      break;
    case totalPoints < 1292:
      rangImgID = "06";
      break;
    case totalPoints < 1650:
      rangImgID = "07";
      break;
    case totalPoints < 2080:
      rangImgID = "08";
      break;
    case totalPoints < 2596:
      rangImgID = "09";
      break;
    case totalPoints < 3215:
      rangImgID = "10";
      break;
    case totalPoints < 3958:
      rangImgID = "11";
      break;
    case totalPoints < 4850:
      rangImgID = "12";
      break;
    case totalPoints < 5920:
      rangImgID = "13";
      break;
    case totalPoints < 7204:
      rangImgID = "14";
      break;

    default:
      break;
  }

  const rangImgUrl: string = `https://raw.githubusercontent.com/av-shell/rslang-ava/master/ranks/Ranks0${rangImgID}.png`;

  let userDay: any = dateUser.getDate();
  if (userDay.toString().length < 2) {
    userDay = `0${userDay}`;
  }
  let userMonth: any = dateUser.getMonth() + 1;
  if (userMonth.toString().length < 2) {
    userMonth = `0${userMonth}`;
  }
  const userYear = dateUser.getFullYear();
  const dateCreateUser = `${userDay}.${userMonth}.${userYear}`;

  function transformDate(dateArr: any) {
    const arr: any = [];

    if (dateArr[0].date) {
      dateArr.forEach((e: any) => {
        const date = new Date(e.date);
        let day: any = date.getDate();
        if (day.toString().length < 2) {
          day = `0${day}`;
        }
        let month: any = date.getMonth() + 1;
        if (month.toString().length < 2) {
          month = `0${month}`;
        }
        const newDate = `${day}/${month}`;
        arr.push(newDate);
      });
    }

    return arr;
  }
  function transformValue(dateArr: any) {
    const arr: any = [];
    if (dateArr[0].value) {
      dateArr.forEach((e: any) => {
        arr.push(e.value);
      });
    }

    return arr;
  }
  function transformValueAll(dateArr: any) {
    const arr: any = [];
    let startValue: number = 0;
    if (dateArr[0].value) {
      dateArr.forEach((e: any) => {
        const difValue: number =
          e.value - startValue < 0 ? 0 : e.value - startValue;
        arr.push(difValue);
        startValue = e.value;
      });
    }

    return arr;
  }

  const dataAll: any = {
    labels: transformDate(userWordsPerDay),
    datasets: [
      {
        data: transformValueAll(userWordsPerDay),
        fill: true,
        borderColor: "#F3F6F9",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    ],
  };
  const dataCorrect: any = {
    labels: transformDate(rightPerDay),
    datasets: [
      {
        data: transformValue(rightPerDay),
        fill: true,
        borderColor: "#7E8299",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    ],
  };
  if (isDarkTheme) {
    dataCorrect.datasets[0].borderColor = "#7E8299";
    dataCorrect.datasets[0].backgroundColor = "rgba(54, 162, 235, 0.3)";
    dataAll.datasets[0].borderColor = "#F3F6F9";
    dataAll.datasets[0].backgroundColor = "rgba(54, 162, 235, 0.3)";
  }

  useEffect(() => {
    dataAll.labels = transformDate(userWordsPerDay);
    dataAll.datasets[0].data = transformValueAll(userWordsPerDay);
    dataCorrect.labels = transformDate(rightPerDay);
    dataCorrect.datasets[0].data = transformValue(rightPerDay);
  }, [props]);

  const optionSwitchTheme = !isDarkTheme
    ? {
        xAxes: [
          {
            gridLines: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              autoskip: true,
              autoSkipPadding: 0,
              beginAtZero: true,
              fontColor: "#666",
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#666",
            },
          },
        ],
      }
    : {
        xAxes: [
          {
            gridLines: {
              color: "rgba(27, 197, 189, 0.3)",
            },
            ticks: {
              autoskip: true,
              autoSkipPadding: 30,
              beginAtZero: true,
              fontColor: "#7E8299",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "#7E8299",
              beginAtZero: true,
            },
            gridLines: {
              color: "rgba(27, 197, 189, 0.2)",
            },
          },
        ],
      };
  console.log(optionSwitchTheme);

  const options: any = {
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,

    scales: optionSwitchTheme,
  };

  console.log(props);
  const avatarUrl = `${AVA_URL}ava_${settings.optional.avatarID}.png`;

  const userName =
    localStorage.getItem("userName") !== null
      ? localStorage.getItem("userName")?.slice(1, -1)
      : "Student";

  let currentLang = isLanguageRU ? RU : EN;
  useEffect(() => {
    currentLang = isLanguageRU ? RU : EN;
  }, [isLanguageRU]);
  useLayoutEffect(() => {
    CreatePieChart();
  }, []);

  const cardCase = [" карточку", " карточки", " карточек"];
  const difCurrentCards = cardsPerDay - currentRightPerDay.value;
  console.log(checkCase(difCurrentCards));

  const choseCards = isLanguageRU
    ? cardCase[checkCase(currentRightPerDay.value)]
    : currentLang.cards;
  const choseCards1 = isLanguageRU
    ? cardCase[checkCase(difCurrentCards)]
    : currentLang.cards;

  function CreatePieChart() {
    const canvas: any = document.getElementById("piechart");
    const ctx: any = canvas.getContext("2d");
    let lastend = 0;
    const data = [totalCards - totalCorrectCards, totalCorrectCards];
    const labelCorrect = Math.floor((totalCorrectCards / totalCards) * 100);
    let myTotal = 0;
    const myColor = ["#F64E60", "#1BC5BD"];
    const labels = [`${100 - labelCorrect}%`, `${labelCorrect}%`];
    const off = 10;
    const w = (canvas.width - off) / 2;
    const h = (canvas.height - off) / 2;
    for (let i = 0; i < data.length; i++) {
      myTotal += data[i];
    }
    for (let i = 0; i < data.length; i++) {
      ctx.fillStyle = myColor[i];
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w, h);
      const len = (data[i] / myTotal) * 2 * Math.PI;
      const r = h - off / 2;
      ctx.arc(w, h, r, lastend, lastend + len, false);
      ctx.lineTo(w, h);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const mid = lastend + len / 2;
      ctx.fillText(
        labels[i],
        w + Math.cos(mid) * (r / 2),
        h + Math.sin(mid) * (r / 2)
      );
      lastend += Math.PI * 2 * (data[i] / myTotal);
    }
  }
  const dailyGoalDone =
    difCurrentCards > 0 ? (
      <p>
        {currentLang.complete}

        {difCurrentCards}
        {choseCards1}
        {currentLang.reach}
      </p>
    ) : (
      <p>{currentLang.dailyGoalDone}</p>
    );
  return (
    <div className='dashboard-page'>
      <div className='dashboard-page-first_column-user_info'>
        <div className='dashboard-page-first_column-user_info-img'>
          <img src={avatarUrl} alt='avatar' />
        </div>
        <div className='dashboard-page-first_column-user_info-data'>
          <div className='dashboard-page-first_column-user_info-data-rangImg'>
            <img src={rangImgUrl} alt='rang' />
          </div>
          <h3>{userName}</h3>
          <p>
            {currentLang.engkishLvl}
            <strong>{UserLvlLang}</strong>
          </p>
          <p>
            {currentLang.learningFrom}
            {dateCreateUser}
          </p>
        </div>
      </div>

      <div className='dashboard-page-second_column-info'>
        <div className='dashboard-page-second_column-info-all_words'>
          {currentLang.newWords}
          <p className='dashboard-page-second_column-info-card-stat'>
            {userNewWords}
          </p>
        </div>
        <div className='dashboard-page-second_column-info-best_series'>
          {currentLang.bestStreak}
          <p className='dashboard-page-second_column-info-card-stat'>
            {bestAll}
          </p>
        </div>
        <div className='dashboard-page-second_column-info-all_cards'>
          {currentLang.totalPassed}
          <p className='dashboard-page-second_column-info-card-stat'>
            {totalCards}
          </p>
        </div>
        <div className='dashboard-page-second_column-info-card_point'>
          {currentLang.yourPoint}

          <p className='dashboard-page-second_column-info-card-stat'>
            {totalPoints}
          </p>
        </div>
      </div>

      <div className='dashboard-page-third_column-daily'>
        <span>{currentLang.dailyGoal}</span>
        <p>
          {currentLang.complete}
          {cardsPerDay}
          {currentLang.cards}.
        </p>
        <p>
          {currentLang.todayCoplited}
          {currentRightPerDay.value}
          {choseCards}.
        </p>
        {dailyGoalDone}
      </div>

      <div className='dashboard-page-first-chart_progress'>
        <div>{currentLang.chartTitle1}</div>
        <div className='chart-wrapper'>
          <Bar data={dataAll} options={options} />
        </div>
      </div>
      <div className='dashboard-page-second-chart_diagram'>
        <div>{currentLang.chartTitle2}</div>
        <canvas id='piechart' height='275' />
        <div className='piechart'>
          <div className='piechart-legend'>
            <div className='piechart-legend-correct' />
            <span>-{currentLang.correctAnswer}</span>
          </div>
          <div className='piechart-legend'>
            <div className='piechart-legend-incorrect'> </div>
            <span>-{currentLang.incorrectAnswer}</span>
          </div>
        </div>
      </div>
      <div className='dashboard-page-third-chart_card_progress'>
        <div>{currentLang.chartTitle3}</div>
        <div className='chart-wrapper'>
          <Line data={dataCorrect} options={options} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
