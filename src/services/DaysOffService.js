import * as API from "@/services/API";

import store from '@/store/index';

import { getDaysInAMonth } from '@/utils/helpers';

export default {
    index() {
        return API.apiClient.get(`/staff/days-off`);
    },
    store(payload) {
        return API.apiClient.post(`/staff/days-off`, payload);
    },
    statuses() {
        return API.apiClient.get(`/staff/days-off/statuses`);
    },
    update(id, payload) {
        return API.apiClient.put(`/staff/days-off/${id}`, payload);
    },
    // destroy(id) {
    //     return API.apiClient.delete(`/staff/days-off/${id}`);
    // },
    indexByPlace() {
        return API.apiClient.get(`/owner/days-off`);
    },
    approve(id) {
        return API.apiClient.put(`/owner/days-off/${id}/approve`);
    },
    decline(id) {
        return API.apiClient.put(`/owner/days-off/${id}/decline`);
    },
};

export function addDaysToCorrectMonth({ dayOffStartDate, numberOfDays, status }) {
    const dateParts = dayOffStartDate.split('-');
    let day = Number(dateParts[0]);
    let month = Number(dateParts[1]) - 1;
    let year = Number(dateParts[2]);

    store.commit('staff/ADD_DAY_OFF_TO_MONTH', {
        day: { number: day, status },
        month,
        year,
    });

    for(let i = 1; i < numberOfDays; i++) {
        const daysInAMonthLeft = getDaysInAMonth(month) - day;
        if(daysInAMonthLeft === 0) {
            if(month + 1 <= 11) {
                month++;
            }else {
                month = 0;
                year++;
            }
            day = 0;
        }

        store.commit('staff/ADD_DAY_OFF_TO_MONTH', {
            day: { number: ++day, status },
            month,
            year,
        });
    }
}
