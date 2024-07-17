export function Dropdown({ rooms, onChange, selectedRoomId, isLoading }) {
    return (
        <select value={selectedRoomId ?? ""} onChange={onChange} disabled={isLoading}>
        <option value="">Choose classroom</option>
        {!rooms ? null : rooms.map((option) => (
            <option key={option.id} value={option.id}>{option.name}</option>
        ))}
        </select>
    );
};