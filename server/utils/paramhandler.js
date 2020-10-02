const paramHandler= (qry)  => {
  let param = {};
  if(qry.argument && qry.query)param= {[qry.argument]: {'$regex':qry.query}}
  if(qry.dates){
    const gte = qry.dates.gte?new Date(qry.dates.gte):null
    let lt = qry.dates.lt?new Date(qry.dates.lt):null
    param.updatedAt = {}
    if(gte)param.meta.updatedAt.$gte=gte
    if(lt){
      param.meta.updatedAt.$lte=lt.setDate(lt.getDate()+1)
    }
  }
  if(qry.department_ID) { param.department_ID = qry.department_ID }
  if(qry.designation_ID) { param.designation_ID = qry.designation_ID }
  if(qry.id) { param._id = qry.id }
  return param
};

module.exports = paramHandler;
