const Attendance = require('./../models/attendance.model');
const HttpStatus = require('http-status-codes');
var lastAttendance = []
class AttendanceController {
    // POST: 
    attendance(req, res,next) {
        const {user_number} = req.body;
        lastAttendance.push({user_number:user_number,time: Date.now()});
        var lastAttendance1 = lastAttendance.filter( o => Date.now() - o.time < 1000);
       
        if(lastAttendance1.length > 1){
            return res.status(HttpStatus.StatusCodes.FORBIDDEN).json(
                {
                    error: {message: 'Can not attendance within 2 seconds, try again later'}
                }
            )
        }
        if(user_number) {
            Attendance.findOneAndUpdate(
                
                    {'user_number': user_number ,'leave_time': null},
                    {$set:{'leave_time': Date.now(), 'update_time': Date.now()}},
                    
            )
                .then(attendance => {
                    if(attendance != null) {
                        return res.json({
                            success: true,
                            message: "update successfully"})
                    }
                    else{
                        const attendance = new Attendance({
                            user_number: user_number,
                            arrival_time: Date.now(),
                            created_at: Date.now(),
                        })
                        attendance.save()
                            .then(() =>{
                                return res.json({
                                    success: true,
                                    message: 'Success Attendance'})
                            })
                            .catch(err => {
                                return res.json(
                                    {
                                        success: false,
                                        error: {err}
                                    }
                                )
                            })
                    }
                    
                })
                .catch((err) => {
                    success = false,
                    res.json(err)
                })
        }
        else{
            return res.json(
                {
                    error: {message: 'Please enter a user number'}
                }
            )
        }
       
    }
    
}

module.exports = new AttendanceController;