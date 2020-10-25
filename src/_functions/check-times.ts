import { RestourantWorkingHours } from "src/restourant/entities/restourant-working-hours.entity";
import { NonWorkingDays } from "src/restourant/entities/non-working-days.entity";
import { OpeningDetails } from "src/restourant/dto/restourant-info.dto";
import { DayOfWeek } from "src/utility/entities/day-of-week.entity";

export function getOpeningDetails(
    dateToCheck: Date,
    restourantWorkingHours: RestourantWorkingHours[],
    restourantNonWorkingDays: NonWorkingDays[],
    daysOfWeek: DayOfWeek[],
    recursiveCall: boolean
): OpeningDetails { // isOpenedCurrently("10:00", "23:00")
    const now = dateToCheck;
    const hrsNow = now.getHours();
    const minsNow = now.getMinutes();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const ordinalNumberOfDay = now.getDay() === 0 ? 7 : now.getDay();
    const todaysWorkingTime = restourantWorkingHours.filter(rwh => rwh.dayOfWeekId === ordinalNumberOfDay)[0];
    if (!todaysWorkingTime) { // ako nije ubaceno radno vreme restorana
        return null;
    }
    if (!todaysWorkingTime.isWorking) { // ako ne radi restoran tog dana idemo dalje
        return getOpeningDetails(tomorrow, restourantWorkingHours, restourantNonWorkingDays, daysOfWeek, true);
    }
    const openingHrs = parseInt(todaysWorkingTime.openingTime.split(':')[0]);
    const openingMin = parseInt(todaysWorkingTime.openingTime.split(':')[1]);
    const openingInMins = openingHrs * 60 + openingMin;

    let closingHrs = parseInt(todaysWorkingTime.closingTime.split(':')[0]);
    const closingMin = parseInt(todaysWorkingTime.closingTime.split(':')[1]);

    let closingInMins = closingHrs * 60 + closingMin;
    // ako je closingTime "02:00" dodaj +24sata jer je to sledeci dan i pritom opening time nije manji "02:00"
    if (todaysWorkingTime.closingTime.split(':')[0].charAt(0) === '0' && closingInMins < openingInMins) {
        closingHrs += 24;
        closingInMins = closingHrs * 60 + closingMin;
    }

    const currentTimeInMins = hrsNow * 60 + minsNow;

    const nowDate: string = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate(); // 2020-10-25

    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayDate: string = yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate();
    const nonWordkingDayToday = restourantNonWorkingDays.find(rnwd => rnwd.date === nowDate);
    const nonWordkingDayYesterday = restourantNonWorkingDays.find(rnwd => rnwd.date === yesterdayDate);

    if (recursiveCall) {
        if (!nonWordkingDayToday) { // ako nije neradni dan
            const openingTimeRecursive = todaysWorkingTime.openingTime.split(':')[0] + ":" + todaysWorkingTime.openingTime.split(':')[1];
            const openingDayRecursive = daysOfWeek.find(day => day.ordinalNumber === ordinalNumberOfDay).name;
            return { isOpened: false, openingTime: openingTimeRecursive, openingDay: openingDayRecursive, closingTime: null };
        }
        // ako jeste neradni dan nastavi dalje dok ne dodje do prvog radnog
        return getOpeningDetails(tomorrow, restourantWorkingHours, restourantNonWorkingDays, daysOfWeek, true);
    }
    let isOpened = !nonWordkingDayToday && currentTimeInMins >= openingInMins && currentTimeInMins <= closingInMins;
    let openingTime: string = null;
    let openingDay: string = null;
    let closingTime: string = null;
    if (isOpened) {
        closingTime = todaysWorkingTime.closingTime;
    }
    else { // if it is closed
        if (!nonWordkingDayToday) { // ako nije neradni dan
            if (currentTimeInMins < openingInMins) { // i ako je vreme otvaranja posle trenutnog, proveriti da li je u toku radno vreme od prethodnog dana: npr. sada je cetvrtak 01:00, a restoran sredom radi 10:00-02:00 => treba da vrati true
                if (!nonWordkingDayYesterday) {
                    const yesterday = ordinalNumberOfDay === 0 ? 6 : ordinalNumberOfDay - 1; // u slucaju da je nedeljea(now.getDay()=0) danas-> juce je nedelja (now.getDay()=0)
                    const yesterdayWorkingTime = restourantWorkingHours.filter(rwh => rwh.dayOfWeekId === yesterday)[0];
                    const yesterdayClosingTimeInHrs = (parseInt(yesterdayWorkingTime.closingTime.split(':')[0]));
                    const yesterdayClosingTimeMins = (parseInt(yesterdayWorkingTime.closingTime.split(':')[1]));
                    const yesterdayClosingTimeInMins = yesterdayClosingTimeInHrs * 60 + yesterdayClosingTimeMins;
                    // treba nam i vreme otvaranja da bismo proverili da li je uopste juce restoran radio posle ponoci
                    // sto bi znacilo da je vreme zatvaranja manje od vremena otvaranja => yesterdayClosingTimeInMins < yesterdayOpeningTimeInMins
                    const yesterdayOpeningTimeInHrs = (parseInt(yesterdayWorkingTime.openingTime.split(':')[0]));
                    const yesterdayOpeningTimeMins = (parseInt(yesterdayWorkingTime.openingTime.split(':')[1]));
                    const yesterdayOpeningTimeInMins = yesterdayOpeningTimeInHrs * 60 + yesterdayOpeningTimeMins;

                    if (yesterdayClosingTimeInMins < yesterdayOpeningTimeInMins && yesterdayClosingTimeInMins >= hrsNow * 60 + minsNow) { // ukoliko jeste zatvara se u yesterdayClosingTime
                        isOpened = true;
                        closingTime = yesterdayWorkingTime.closingTime;
                    }
                    else { // trenutno zatvoren -> otvara se u danasnjih openingHrs
                        openingTime = todaysWorkingTime.openingTime.split(':')[0] + ":" + todaysWorkingTime.openingTime.split(':')[1];;
                        openingDay = daysOfWeek.find(day => day.ordinalNumber === ordinalNumberOfDay).name;
                    }
                }
                else { // ako je bio neradan dan juce 
                    openingTime = todaysWorkingTime.openingTime.split(':')[0] + ":" + todaysWorkingTime.openingTime.split(':')[1];;
                    openingDay = daysOfWeek.find(day => day.ordinalNumber === ordinalNumberOfDay).name;
                }
            }
            else { // ako je trenutno vreme posle vremena zatvaranja, nastavi proveri za sutradan
                return getOpeningDetails(tomorrow, restourantWorkingHours, restourantNonWorkingDays, daysOfWeek, true);
            }
        }
        else { // ako je neradni dan danas, nastavi proveri za sutradan
            return getOpeningDetails(tomorrow, restourantWorkingHours, restourantNonWorkingDays, daysOfWeek, true);
        }
    }
    return { isOpened, openingTime, openingDay, closingTime };
}
