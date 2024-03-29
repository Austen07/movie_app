export const calcTime = (time) => {
  const hours = Math.floor(time / 60);
  const mins = time % 60;

  return `${hours}h ${mins}m`;
}

export const convertToMoney = (money) => {
  const formatter = new Intl.NumberFormat('en-Us', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  });

  return formatter.format(money);
}