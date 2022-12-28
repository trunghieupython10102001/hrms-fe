import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { EEnterpriseType, IEnterpriseFilterForm } from '@/interface/business';
import { bussinessAreaAsyncActions } from '@/stores/businessArea.store';
import { Button, Col, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import './Filter.less';

interface IComponentProps {
  filter: IEnterpriseFilterForm;
  onFilter: (form: IEnterpriseFilterForm) => void;
  onClearFilter: () => void;
}

export default function EnterpriseFilter({ filter, onFilter, onClearFilter }: IComponentProps) {
  const [filterForm] = Form.useForm<IEnterpriseFilterForm>();
  const {
    data: { bussinessAreas: areas },
    status: fetchAreasStatus,
  } = useAppSelector(state => state.businessArea);

  const dispatch = useAppDispatch();

  const filterEnterpriseHander: FormProps<IEnterpriseFilterForm>['onFinish'] = form => {
    onFilter({
      enterpriseArea: form.enterpriseArea,
      enterpriseEmail: form.enterpriseEmail?.trim(),
      enterpriseName: form.enterpriseName?.trim(),
      enterprisePhone: form.enterprisePhone?.trim(),
      enterpriseType: form.enterpriseType,
    });
  };

  const clearFilterHandler = () => {
    onClearFilter();

    onFilter({
      enterpriseArea: undefined,
      enterpriseEmail: '',
      enterpriseName: '',
      enterprisePhone: '',
      enterpriseType: undefined,
    });
  };

  useEffect(() => {
    if (fetchAreasStatus === 'init' || fetchAreasStatus === 'error') {
      dispatch(bussinessAreaAsyncActions.getBusinessAreaList());
    }
  }, [fetchAreasStatus]);

  useEffect(() => {
    filterForm.setFieldsValue(filter);
  }, [filter]);

  return (
    <Form<IEnterpriseFilterForm>
      form={filterForm}
      layout="vertical"
      className="enterprise-filter"
      onFinish={filterEnterpriseHander}
    >
      <div className="flex justify-between">
        <h3>Tìm kiếm doanh nghiệp</h3>
        <Button type="link" onClick={clearFilterHandler}>
          Xóa tất cả
        </Button>
      </div>
      <Row gutter={40}>
        <Col span={12}>
          <Form.Item name="enterpriseName" label="Tên doanh nghiệp">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="enterpriseEmail" label="Email">
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={40} className="enterprise-filter__last-row">
        <Col span={7}>
          <Form.Item name="enterprisePhone" label="Số điện thoại">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item name="enterpriseType" label="Loại hình doanh nghiệp">
            <Select className="capitalized" size="large">
              <Select.Option className="capitalized" value={''}>
                --
              </Select.Option>
              {EEnterpriseType.map((type, i) => {
                if (i > 0) {
                  return (
                    <Select.Option className="capitalized" value={i} key={i}>
                      {type}
                    </Select.Option>
                  );
                }
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item name="enterpriseArea" label="Lĩnh vực kinh doanh">
            <Select className="capitalized" size="large" loading={fetchAreasStatus === 'loading'}>
              <Select.Option className="capitalized" value={''}>
                --
              </Select.Option>
              {areas.map(area => {
                return (
                  <Select.Option className="capitalized" value={area.id} key={area.id}>
                    {area.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={3}>
          <div className="flex h-full">
            <Button htmlType="submit" className="enterprise-filter__submit-btn" type="primary">
              Lọc
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
