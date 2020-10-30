export default {
    data () {
        return {
            columnsFlights: [
                {
                    title: '路线',
                    slot: 'line',
                    align: 'center'
                },
                {
                    title: '城际车辆',
                    key: 'cars',
                    align: 'center'
                },
                {
                    title: '司机',
                    key: 'driver',
                    align: 'center'
                },
                {
                    title: 'Action',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            dataFlights: [
                {
                    line:'成都-康定',
                    cars:'川A55555',
                    driver:'丫丫'
                }
            ]
        }
    },
    methods: {
        show (index) {
            this.$Modal.info({
                title: 'User Info',
                content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
            })
        },
        remove (index) {
            this.data6.splice(index, 1);
        }
    }
}