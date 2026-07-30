const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date): Date =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const formatElapsedTime = (publishedAt: string, now: Date = new Date()): string => {
    const published = new Date(publishedAt);
    const publishedDay = startOfDay(published);
    const nowDay = startOfDay(now);

    if (publishedDay.getTime() === nowDay.getTime()) {
        return "今日";
    }

    const oneYearLater = new Date(published);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (now < oneYearLater) {
        const daysDiff = Math.round((nowDay.getTime() - publishedDay.getTime()) / MS_PER_DAY);
        return `${daysDiff}日前`;
    }

    let years = now.getFullYear() - published.getFullYear();
    const anniversaryThisYear = new Date(published);
    anniversaryThisYear.setFullYear(published.getFullYear() + years);
    if (anniversaryThisYear > now) {
        years -= 1;
    }
    return `${years}年前`;
};
