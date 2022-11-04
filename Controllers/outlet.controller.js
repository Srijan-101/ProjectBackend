
const { PrismaClient } = require("@prisma/client");
const { user, outlet, menu, menuItem, customerTable } = new PrismaClient();


//createOutlet
exports.createOutlet = async (req, res) => {
    try {
        const { outletName, location, ManagerEmail, phoneNumber } = req.body;
        const getUser = await user.findFirst({
            where: { email: ManagerEmail },
            select: { Post: true }
        })

        if (!getUser) { return res.status(400).json({ message: "No worker found assoicated with this email address" }) };
        if (getUser.Post === "Manager") { return res.status(400).json({ message: "Worker associated with this email is manager of another outlet" }) }
        else {
            try {
                const createOutlet = await outlet.create({
                    data: {
                        outletName,
                        location,
                        phone: phoneNumber,
                    }, select: {
                        id: true
                    }
                })
                await user.update({
                    where: {
                        email: ManagerEmail
                    },
                    data: {
                        outletId: createOutlet.id,
                        Post: "Manager"
                    }
                })
                if (createOutlet) {
                    res
                        .status(200)
                        .json({ message: "Outlet created sucessfully" });
                }
            } catch (e) {
                console.log(e);
                res
                    .status(400)
                    .json({ error: "Server error.Please try again later." });
            }
        }
    } catch (e) {
        res
            .status(400)
            .json({ error: "Server error.Please try again later." });
    }
}

//getOutlet
exports.getAllOutlet = async (req, res) => {
    const { email } = req.body
    try {
        const confirmUser = await user.findFirst({
            where: { email },
            select: { firstName: true, role: true, email: true, lastName: true }
        })
        if (confirmUser.role === "Admin") {
            const outletInfo = await outlet.findMany({
                select: {
                    id: true,
                    outletName: true,
                    location: true,
                    phone: true,
                    Worker: {
                        where: {
                            Post: "Manager"
                        },
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    }
                }
            })
            if (outletInfo) res.status(200).json(outletInfo)
        } else {
            return res.status(400).json({ error: "Acess denied" });
        }
    } catch (e) {
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}

//getOutletNumber 
exports.getOutletNumber = async (req, res) => {
    const { email } = req.body
    try {
        const confirmUser = await user.findFirst({
            where: { email },
            select: { firstName: true, role: true, email: true, lastName: true }
        })
        if (confirmUser.role === "Admin") {
            const outletInfo = await outlet.findMany({
                select: {
                    id: true,
                    outletName: true,
                    location: true,
                    phone: true,
                    Worker: {
                        where: {
                            Post: "Manager"
                        },
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    }
                }
            })
            if (outletInfo) res.status(200).json(outletInfo.length)
        } else {
            return res.status(400).json({ error: "Acess denied" });
        }
    } catch (e) {
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}


//getAllworkerDetails
exports.getAllWorkerDetails = async (req, res) => {
    const { email } = req.body
    try {

        const confirmUser = await user.findFirst({
            where: { email },
            select: { role: true }
        })

        if (confirmUser.role === "Admin") {
            const WorkerInfo = await user.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    Post: true,
                    email: true,
                    phoneNumber: true,
                    Outlet: {
                        select: {
                            outletName: true,
                        }
                    },
                },
                where: {
                    role: "Worker",
                    isActivate: true
                }
            })
            if (WorkerInfo) res.status(200).json(WorkerInfo)
        } else {
            return res.status(400).json({ error: "Acess denied" });
        }
    } catch (e) {
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}

//AddWorker - by Manager
exports.AddWorker = async (req, res) => {
    const { post, email, phonenumber, outletId } = req.body;
    try {
        const userR = await user.findFirst({
            where: {
                email,
            },
            select: {
                firstName: true,
                lastName: true,
                outletId: true,
                role: true,
                Post: true
            }
        })
        try {

            if (userR) {
                console.log(userR);
                if (userR.outletId || userR.role == "Admin" ) {
                    return res.status(400).json({ error: "This worker is already working at an outlet." });
                } else if(userR.outletId && !userR.Post) {
                    return res.status(400).json({ error: "This worker is already working at an outlet." });
                } else {
                    await user.update({
                        data: {
                            outletId: outletId,
                            Post: post,
                            phoneNumber: phonenumber
                        }, where: {
                            email
                        }
                    })
                    return res.status(200).json({ message: "Worker Added sucessfully!" })
                }
            } else { return res.status(400).json({ error: "No worker found assoicated with this email " }) }
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: "Server error.Please try again later." });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}


//getOutletInformationById
exports.getOutletById = async (req, res) => {
    const id = req.params['id'];
    console.log(req.params['id']);

    try {
        const OutletInformation = await outlet.findFirst({
            where: {
                id
            }
        })
        const userR = await user.findMany({
            where: {
                outletId: id
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                Post: true,
                phoneNumber: true,
                email: true
            }
        })
        res.status(200).json({ OutletInformation, userR });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}








//deleteWorker
exports.deleteWorker = async (req, res) => {
    const { userId, outletId } = req.body;
    try {
        const userR = await user.findFirst({
            where: {
                id: userId,
                outletId: outletId
            }
        })
        if (userR) {
            await user.update({
                data: {
                    Post: null,
                    outletId: null
                },
                where: {
                    id: userId
                }
            })
            return res.status(200).json({});
        } else { return res.status(400).json({ error: "Server error.Please try again later." }); }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}


//CreateMenu
exports.AddMenu = async (req, res) => {
    const { Name, Category, Price, Status, outletId } = req.body;
    try {
        await outlet.findFirst({
            where: {
                id: outletId
            },
            select: {
                menuId: true
            }
        })
            .then(async (res) => {
                if (!res.menuId) {
                    const data = await menu.create({
                        data: {
                            MenuItem: {
                                create: {
                                    Name: "Momo",
                                    price: Price,
                                    Status: 'Available',
                                    Category,
                                
                                }
                            }
                        }
                    })
                    await outlet.update({
                        data: {
                            menuId: data.id
                        },
                        where: {
                            id: outletId
                        }
                    })
                } else {
                    await menu.update({
                        data: {
                            MenuItem: {
                                create: {
                                    Name: Name,
                                    price: Price,
                                    Status: 'Available',
                                    Category,
                                 
                                }
                            }
                        },
                        where: {
                            id: res.menuId
                        }
                    })
                }
            })
        return res.status(200).json({ message: "Item sucessfully added to menu" });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}


//getMenubyOutlet 
exports.GetMenu = async (req, res) => {
    const outletId = req.user.outletId;
    try {
        const data = await outlet.findUnique({
            where: {
                id: outletId
            },
            select: {
                Menu: true,
            }
        })
        const Menu = await menuItem.findMany({
            where: {
                menuId: data.Menu.id
            }
        })
        return res.status(200).json(Menu);
    }
    catch (e) {
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}




//DeleteMenu
exports.DeleteMenu = async (req, res) => {
    try {
        const menu = await menuItem.delete({
            where: {
                id: req.body.id
            }
        })
        console.log(menu);
        return res.status(200).json({ Sucessful });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}


exports.UpdateMenu = async (req, res) => {
    try {
        const menu = await menuItem.update({
            where: {
                id: req.body.id
            },
            data: {
                Name: req.body.name,
                price: req.body.price,
                Category: req.body.category,
                Status: req.body.status
            }
        })

        menu ? res.status(200).json({ error: "Sucessfully edited" }) : res.status(400).json({ error: "Server error.Please try again later." });
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}



//AddTable
exports.AddTable = async (req, res) => {
    const outletId = req.user.outletId;
    try {
        const outletID = await outlet.update({
            data: {
                customerTable: {
                    create: {
                        Name: Math.random().toString()
                    }
                }
            },
            where: {
                id: outletId
            }
        })

        if (outletID) {
            return res.status(200).json({ error: "Sucessful" });
        } else {
            return res.status(400).json({ error: "Server error.Please try again later." });
        }

    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}

//GetTable
exports.GetTable = async (req, res) => {
    try {
        const Table = await outlet.findFirst({
            where: {
                id: req.user.outletId
            },
            select: {
                customerTable: true
            }
        })
        if (Table) { res.status(200).json(Table) }
        else { return res.status(400).json({ error: "Server error.Please try again later." }); }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}

exports.DeleteTable = async (req, res) => {
    try {
        const Table = await customerTable.delete({
                where : {
                     id : req.body.id
                } 
        })
        if(Table) {
            return res.status(200).json({message: "Sucessful" });
        }else {
            return res.status(400).json({ error: "Server error.Please try again later." });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Server error.Please try again later." });
    }
}


//AddOrder 
exports.AddOrder = async (req, res) => {

}

//DeleteOrder 
exports.DeleteOrder = async (req, res) => {

}

//generateBills
exports.GenerateBills = async (req, res) => {

}

//IndividualSaleWithReceiptId
exports.GenerateBills = async (req, res) => {

}


exports.getTotalSales = async (req, res) => {

}

//
exports.getTotalSalesbyId = async (req, res) => {

}


exports.getMonthlySalesbyId = async (req, res) => {

}

