const { PrismaClient } = require("@prisma/client");
const { user, outlet,sales,orderItem} = new PrismaClient();
const{ Parser } = require('json2csv');


exports.AddSales = async (req,res) => {
     console.log(req.body);
     try {
        const data =  await sales.create({
              data : {
                 PaymentMethod : req.body.PaymentMethod,
                 SaleAmount : parseFloat(req.body.TotalAmount),
                 ReceiptNo : req.body.ReceiptNo,
                 outletId : req.user.outletId
              }
         })

         if(data) {
            req.body?.ItemsId?.map(async (ele) => {
               await orderItem.delete({
                   where : {
                       id : `${ele}`
                   }
               })
           })
           
           return res.status(200).json({ error: "Sucessful" });
         }else{
            return res.status(400).json({ error: "Server error.Please try again later." });
         }
     }catch(e){
        console.log(e);
        return res.status(400).json({ error: "Server error.Please try again later." });
     }
}


//OutletId
exports.GetDailySalesById = async (req,res) => {
    const id = req.params.outletId;
     try {
         const SalesData = await sales.findMany({
              where : {
                 outletId : id
              }
         })
         const Day = new Date().getDate();
         const Month = new Date().getMonth();
         let TotalSales = 0;
         SalesData?.map((ele) => {
                 let SalesDay = new Date(ele.createdAt).getDate();
                 let SalesMonth = new Date(ele.createdAt).getMonth();
                 if((SalesDay === Day) && (SalesMonth === Month))  TotalSales = TotalSales + ele.SaleAmount;
         })
         return res.status(200).json(TotalSales);
     }catch(e){
      console.log(e);
      return res.status(400).json({ error: "Server error.Please try again later." });
     }
}

//getSalesbyMonth 
exports.GetMonthlySalesById = async(req,res) => {
   const id = req.params.outletId;
   try {
       const SalesData = await sales.findMany({
            where : {
               outletId : id
            }
       })
       let MonthlySales = [
           {name : "Jan",amount : 0},
           {name : "Feb",amount : 0},
           {name : "Mar",amount : 0},
           {name : "Apr",amount : 0},
           {name : "May",amount : 0},
           {name : "Jun",amount : 0},
           {name : "Jul",amount : 0},
           {name : "Aug",amount : 0},
           {name : "Sep",amount : 0},
           {name : "Oct",amount : 0},
           {name : "Nov",amount : 0},
           {name : "Dec",amount : 0},
       ]
       
       SalesData?.map((ele) => {
             let SalesMonth = new Date(ele.createdAt).getMonth();
             MonthlySales[SalesMonth].amount = MonthlySales[SalesMonth].amount + ele.SaleAmount;
       }) 
       return res.status(200).json(MonthlySales);
   }catch(e){
    console.log(e);
    return res.status(400).json({ error: "Server error.Please try again later." });
   }
}
 





//Daily Sales
exports.GetDailySales = async(req,res) => {
   try {
       const SalesData = await sales.findMany({
              select : {
                   SaleAmount : true,
                   createdAt : true,
                   Outlet : {
                       select : {
                         outletName : true
                       }
                   }
              },
              where : {
                 Outlet :{
                     AdminId : req.user.id
                 }
              }
       })
         const Day = new Date().getDate();
         const Month = new Date().getMonth();
         let Final = [];
         
         const unique = [...new Set(SalesData.map(item => item.Outlet.outletName ))];
         unique.map((ele) => {
              Final.push({
                    name : ele,
                    amount : 0
              })
         })

         SalesData?.map((ele) => {
             Final.map((k) => {
                let SalesDay = new Date(ele.createdAt).getDate();
                let SalesMonth = new Date(ele.createdAt).getMonth();
                if((SalesDay === Day) && (SalesMonth === Month) && (ele.Outlet.outletName === k.name))  k.amount = k.amount + ele.SaleAmount;
             })
         })
         return res.status(200).json(Final);
   }catch(e){
    console.log(e);
    return res.status(400).json({ error: "Server error.Please try again later." });
   }
}






//GenerateSales
exports.GenerateCSV = async (req,res) => {
     try {
        const SalesData = await sales.findMany({
            select : {
                 SaleAmount : true,
                 createdAt  : true,
                 ReceiptNo : true,
                 PaymentMethod : true,
            },
            where : {
               outletId : req.params.outletId
            }
     })
     
     console.log(SalesData);
     
     let Final = []
     SalesData?.map((ele) => {
         Final.push({
             ReceiptNo : ele.ReceiptNo,
             PaymentDate : new Date(ele.createdAt).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}),
             PaymentMethod : ele.PaymentMethod,
             Amount : ele.SaleAmount
         })
     })
    
     const json2csv = new Parser();
     const csv = json2csv.parse(Final);
     res.header('Content-Type', 'text/csv');
     res.attachment("SalesData.csv");
     
     return res.status(200).send(csv);


     }catch(e){
        console.log(e);
        return res.status(400).json({ error: "Server error.Please try again later." });
     }
}
