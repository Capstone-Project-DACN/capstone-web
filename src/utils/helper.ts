export function timeDifferenceLocalized(timestamp: any, locale = 'en') {
    const now = new Date();
    const past = new Date(timestamp);
    // const diffInSeconds = Math.floor((now - past) / 1000);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
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

  export function cronToMilliseconds(cron: string) {
    if(!cron) return 0;
    
    const [second, minute, hour, day, month, dayOfWeek] = cron.split(" ");
  
    // Mặc định khoảng thời gian là null
    let intervalInMs = null;
  
    if (second.includes("*/")) {
      intervalInMs = parseInt(second.split("*/")[1]) * 1000;
    } else if (minute.includes("*/")) {
      intervalInMs = parseInt(minute.split("*/")[1]) * 60 * 1000;
    } else if (hour.includes("*/")) {
      intervalInMs = parseInt(hour.split("*/")[1]) * 60 * 60 * 1000;
    } else if (day.includes("*/")) {
      intervalInMs = parseInt(day.split("*/")[1]) * 24 * 60 * 60 * 1000;
    } else if (month.includes("*/")) {
      intervalInMs = parseInt(month.split("*/")[1]) * 30 * 24 * 60 * 60 * 1000; 
    }
  
    return intervalInMs;
  }

  export function convertTimeToMs(str: any) {
    const units = {
      s: 1000,         // giây
      m: 60 * 1000,    // phút
      h: 60 * 60 * 1000 // giờ
    };
  
    const match = /^([\d.]+)([smh])$/i.exec(str.trim());
  
    if (!match) {
      throw new Error("Invalid time format. Use formats like '1s', '2.5m', '1h'");
    }
  
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
  
    return value * units[unit];
  }
  

  export function convertMillisecondsToTimeUnit(ms: any) {
    if (ms % (24 * 60 * 60 * 1000) === 0) {
      return `${ms / (24 * 60 * 60 * 1000)}d`; // ngày
    } else if (ms % (60 * 60 * 1000) === 0) {
      return `${ms / (60 * 60 * 1000)}h`; // giờ
    } else if (ms % (60 * 1000) === 0) {
      return `${ms / (60 * 1000)}m`; // phút
    } else if (ms % 1000 === 0) {
      return `${ms / 1000}s`; // giây
    } else {
      return `${ms}ms`; // giữ nguyên nếu không chia hết
    }
  }
  

export function millisecondsToCron(ms: any) {
    const sec = 1000;
    const min = 60 * sec;
    const hour = 60 * min;
    const day = 24 * hour;
    const month = 30 * day; // xấp xỉ
  
    if (ms % month === 0) {
      const every = ms / month;
      return `0 0 0 1 */${every} *`; // mỗi N tháng
    } else if (ms % day === 0) {
      const every = ms / day;
      return `0 0 0 */${every} * *`; // mỗi N ngày
    } else if (ms % hour === 0) {
      const every = ms / hour;
      return `0 0 */${every} * * *`; // mỗi N giờ
    } else if (ms % min === 0) {
      const every = ms / min;
      return `0 */${every} * * * *`; // mỗi N phút
    } else if (ms % sec === 0) {
      const every = ms / sec;
      return `*/${every} * * * * *`; // mỗi N giây
    } else {
      return "Invalid input: milliseconds must be divisible by 1000 to convert to a cron expression.";
    }
  }
  