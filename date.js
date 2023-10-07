const now = new Date();
const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
const formattedDate = now.toLocaleString(undefined, options) + ' -> ';

module.exports = {
    now: formattedDate
  };