'use client'
import { useState, useEffect } from "react";
import moment from "moment";
import {Calendar, momentLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as api from "../../api/api";
import {Modal, BookingModal} from "./modal"
import {Dropdown} from "./Dropdown"

const localizer = momentLocalizer(moment);

export default function calendar(){
    const [showDelete, setShowDelete] = useState(false);
    const [isLoading, setIsloading] = useState(true);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [persons, setPersons] = useState([]);
    const [bookingCallback, setBookingCallback] = useState([]);

    useEffect( () => {
        api.getRooms().then((rooms_) => {
            setRooms(rooms_);
            api.getPersons().then((persons_) => {
                setPersons(persons_);
                setIsloading(false);
            });
        });
    }, []);

    const updateBookings = () => {
        if (!selectedRoomId) return;
        api.getBookings(selectedRoomId).then((bookings) => {
            const calendarEvents = bookings.map(({date, personId}) => ({
                start: moment(date, "DD.MM.YYYY").toDate(),
                end: moment(date, "DD.MM.YYYY").add(1, "day").toDate(),
                title: persons.find((p) => p.id == +personId).name,
                data: {
                    roomId: selectedRoomId,
                    personId: personId,
                    date: date
                }
            }));
            setEvents(calendarEvents);
        });
    };

    useEffect(updateBookings, [selectedRoomId]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowDelete(true);
    }

    const handleSelectSlot = (event) => {
        if (!selectedRoomId) return;
        const date = moment(event.start).format("DD.MM.YYYY");

        setBookingCallback([(personId) => {
            setBookingCallback([]);
            api.createBooking(personId, selectedRoomId, date);
            updateBookings();
        }]);
    };

    const handleDelete = () => {
        setShowDelete(false);
        api.deleteBooking(selectedEvent.data.roomId, selectedEvent.data.date);
        updateBookings();
    }

    return (
        <div className="bg-linear-gradient-to-b from-purple-950 to-violet-500 border rounded-md m-4 p-2">
            <div className="">
                {isLoading
                ? (<p>Classroom info loading...</p>)
                : (<Dropdown 
                    rooms={rooms}
                    onChange={(e) => { setSelectedRoomId(e.target.value); }}
                    selectedRoomId={selectedRoomId}
                    isLoading={isLoading} 
                />)}
                <div className="bg-white cal">
                    <Calendar
                        events={events}
                        localizer={localizer}
                        startAccessor="start"
                        endAccessor="end"
                        onSelectEvent={handleEventClick}
                        onSelectSlot={handleSelectSlot}
                        style={{"height": "500px", "backgroundColor": "#1D7373"}}
                        eventPropGetter={ (event) => ({
                            style:{backgroundColor: "#FF7400"}
                        })}
                        selectable
                    />
                </div>
            </div>

            <Modal title="Delete booking"
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
            >
                <div>
                    <p>you sure you want to delete booking?</p>
                    <button className="btn" onClick={handleDelete}>Yes</button>
                    <button className="btn" onClick={() => setShowDelete(false)}>No</button>
                </div>
            </Modal>

            <Modal title="Create booking"
                isOpen={bookingCallback.length != 0}
                onClose={() => setBookingCallback([])}
            >
                <BookingModal
                    persons={persons}
                    callback={bookingCallback[0]}
                    onCancel={() => setBookingCallback([])}
                />
            </Modal>
        </div>
    );
}