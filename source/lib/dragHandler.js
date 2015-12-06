export default (onDragStart, onDragMove, onDragEnd = () => {}) => {
    return function onMouseDown(e){
        e.preventDefault();
        e.stopPropagation();

        onDragStart(e);

        //check for changes
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    function onMouseUp(e){
        e.stopPropagation();

        onDragEnd();

        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('mouseup', onMouseUp);
    }
};
