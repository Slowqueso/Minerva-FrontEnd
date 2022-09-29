import ethPrice from "eth-price";

const convertUsdToETH = async (usdPrice) => {
  const ethPriceValue = await ethPrice("usd");
  const ethPriceInUSD = parseInt(ethPriceValue[0].split(": ")[1]);
  const ethValue = (usdPrice - 0.01) / ethPriceInUSD;
  return ethValue.toFixed(6);
};

export default convertUsdToETH;
