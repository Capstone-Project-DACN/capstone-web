
export function timeDifferenceLocalized(timestamp: any, locale = 'en') {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
  
    if (!isFinite(diffInSeconds)) {
      return ""
    }
  
    const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
    // const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: "auto" });
  
    if (diffInSeconds < 60) {
      return rtf.format(-Math.round(diffInSeconds), 'second');
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.round(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.round(diffInSeconds / 3600), 'hour');
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.round(diffInSeconds / 86400), 'day');
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.round(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(-Math.round(diffInSeconds / 31536000), 'year');
    }
  }
  

  export function formatTimestampToDate(timestamp: any) {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  }


  export function formatNumber(num: any) {
    if (typeof num !== "number") return num;
    
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  }