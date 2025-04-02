
document.addEventListener("DOMContentLoaded", async () => {
    console.log("ok");

    // const url = "https://zelda.fanapis.com/api/games/5f6ce9d805615a85623ec2b7"
    const url = "https://zelda.fanapis.com/api/games";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    console.log(data.data[2].description);
})