import axios from 'axios'
import {Device} from '../models/device.model.js'
import { io } from '../sockets.js'
const get_programs_list = async (req, res) => {
    try {
        const { _id } = req.params
        if(!_id || _id === 'undefined'){
            return res.status(400).json(
                {
                    message: 'id required'
                }
            )
        }
        const device_Details = await Device.findById(_id)
        if (!device_Details) {
            return res.status(400).json({
                message: "device not found"
            })
        }
        let programs = device_Details.all_apps
        if(!programs){
            return res.status(400).json(
                {
                    message: "no programs found for the device "+_id
                }
            )
        }  
        return res.status(200).json(programs)
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
        console.log(error)
    }
}

const get_devices_list = async (req, res) => {
    const devices = await Device.find()
    return res.status(200).json(devices)
}

const get_device_info = async (req, res) => {
    try {
        const { _id } = req.params

        
        if(!_id || _id === 'undefined'){
            return res.status(400).json({message:"ID needed to get device info"})
        }
        const device = await Device.findById(_id)
        if(!device){
            return res.status(404).send({message:"Device not found"})
        }
        return res.status(200).json(device.toJSON())
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
        console.log(error)
    }
}

const get_firewall_rules = async (req, res) => {
    try {
        const { _id } = req.params
        if(!_id || _id === 'undefined'){
            return res.status(400).json({
                message: 'id need to get firerules'
            })
        }
        const device = await Device.findById(_id)
        if(!device.socket_id){
            return res.status(500).send("Invalid device id")
        }
        const device_socket_id = device.socket_id
        
        return res.status(200).json(rules.data)
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"})
        console.log(error)
    }
}

const set_firewall_rules = async (req, res) => {
    
    try {
        const { _id } = req.params
        if (!_id || _id === 'undefined') {
            return res.status(400).json({
                message: 'id needed to set firewall rule'
            })
        }
        const { rulename,app_path,direction,localip,remoteip,protocol,localport,remoteport,action } = req.body
        const rule = {
            rulename,
            app_path,
            direction,
            localip,
            remoteip,
            protocol,
            localport,
            remoteport,
            action

        }
        
        if(!rule){
            return res.status(400).json({message:"Rules needed"})
        }
        const device = await Device.findById(_id)
        if(!device.socket_id){
            return res.status(500).send("Invalid device id")
        }
        const device_socket_id = device.socket_id
        // const response = await axios.post(`http://localhost:8000/agent/set-firewall-rule`,{rules})
        try {
            
            await io.to(device_socket_id).emit('set_firewall_rule',rule)
            return res.status(200).send(true)
        } catch (error) {
            console.log(error);
            
        }
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"})
        console.log(error)
    }
}

export  { get_programs_list, get_devices_list, get_device_info, set_firewall_rules,get_firewall_rules }