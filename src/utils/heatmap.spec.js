import { chunkWeeks, getCalendar } from './heatmap';
import { stringifyDate } from './date';

describe('heatmap utils', () => {
    describe('getCalendar', () => {
        it('weekly start and end dates', () => {
            const calendar = getCalendar({
                colors: [],
                data: [],
                emptyColor: '#000',
                startDate: '2020-01-15T00:00:00',
                endDate: '2020-01-16T00:00:00',
                view: 'weekly',
            });

            const startDate = calendar[0].date;
            const endDate = calendar[calendar.length - 1].date;
            
            expect(stringifyDate(startDate)).toBe('2020-01-12');
            expect(stringifyDate(endDate)).toBe('2020-01-18');
        });

        it('monthly start and end dates', () => {
            const calendar = getCalendar({
                colors: [],
                data: [],
                emptyColor: '#000',
                endDate: '2020-01-16T00:00:00',
                startDate: '2020-01-15T00:00:00',
                view: 'monthly',
            });

            const startDate = calendar[0].date;
            const endDate = calendar[calendar.length - 1].date;
            
            expect(stringifyDate(startDate)).toBe('2020-01-01');
            expect(stringifyDate(endDate)).toBe('2020-01-31');
        });

        it('aggregates values', () => {
            const calendar = getCalendar({
                colors: [],
                data: [
                    { date: '2020-01-15T00:00:00', value: 1 },
                    { date: '2020-01-15T00:00:00', value: 2 },
                    { date: '2020-01-16T00:00:00', value: 5 },
                ],
                emptyColor: '#000',
                startDate: '2020-01-15T00:00:00',
                endDate: '2020-01-16T00:00:00',
                view: 'weekly',
            });

            expect(calendar[0].value).toBe(0);
            expect(calendar[1].value).toBe(0);
            expect(calendar[2].value).toBe(0);
            expect(calendar[3].value).toBe(3);
            expect(calendar[4].value).toBe(5);
            expect(calendar[5].value).toBe(0);
            expect(calendar[6].value).toBe(0);
        });

        it('does not create an empty week', () => {
            const calendar = getCalendar({
                colors: [],
                data: [
                    { date: '2022-12-18T12:00:00', value: 1 },
                    { date: '2022-12-19T12:00:00', value: 1 },
                    { date: '2022-12-20T12:00:00', value: 1 },
                    { date: '2022-12-21T12:00:00', value: 1 },
                    { date: '2022-12-22T12:00:00', value: 1 },
                ],
                emptyColor: '#000',
                startDate: '2022-12-24T11:00:00',
                endDate: '2024-12-24T11:00:00',
                view: 'weekly',
            });

            const chunks = chunkWeeks({
                allowOverflow: false,
                calendar,
                startDate: '2022-12-24T11:00:00',
                endDate: '2024-12-24T11:00:00'
            })

            for (const chunk of chunks) {
                expect(chunk.length).toBeGreaterThan(0);
            }
        });
    });
});