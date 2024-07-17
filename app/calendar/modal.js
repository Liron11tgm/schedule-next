export function Modal({ title, isOpen, onClose, children }) {
    return isOpen &&
      (<div className="fixed z-10 inset-0 overflow-y-auto block" >
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity block">
        <div className="z20 flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
              </button>
            </div>
            {children}
          </div>
        </div>
        </div>
      </div>);
  }

export function BookingModal({ persons, callback, onCancel }) {
    const onSubmit = (e) => {
        e.preventDefault();
        const personId = e.target.selectedPerson.value;
        callback(personId);
    };

    return (
        <form onSubmit={onSubmit}>
            <p>Book a classroom</p>
            <select id="selectedPerson">
                <option value="">Choose teacher</option>
                {persons.map((person) => (
                    <option key={person.id} value={person.id}>{person.name}</option>
                ))}
            </select>
            <button className="btn" type="submit">Book</button>
            <button className="btn" onClick={onCancel}>Cancel</button>
        </form>
    );
}