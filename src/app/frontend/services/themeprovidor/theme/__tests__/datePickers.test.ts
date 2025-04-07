import { DatePicker } from '../datePickers';

describe('DatePicker Component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<DatePicker />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle date change', () => {
    const onChangeMock = jest.fn();
    const wrapper = shallow(<DatePicker onChange={onChangeMock} />);
    wrapper.find('input').simulate('change', { target: { value: '2023-01-01' } });
    expect(onChangeMock).toHaveBeenCalledWith('2023-01-01');
  });
});